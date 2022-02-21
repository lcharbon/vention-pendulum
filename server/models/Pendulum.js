class Pendulum {
    active = false;
    angle = 0;
    x = 0;
    y = 0;
    pivotX = 0;
    fps = 20;
    length = 0;
    gravity = 9.81;
    angularVelocity = 0; // Angle per unit time.
    angularAcceleration = 0;
    mass = 0;
    bobRadius = 0;
    refreshIntervalId = 0;
    sampleTime = 0;

    constructor(opt) {
        this.cradle = opt.cradle;

        this.active = opt.active;
        this.angle = opt.angle;
        this.pivotX = opt.pivotX;
        this.length = opt.length;
        this.mass = opt.mass;
        this.bobRadius = opt.bobRadius;
    }

    bobCordinates() {
        this.x = this.length/100 * Math.sin(this.angle) + this.pivotX;
        this.y = this.length/100 * Math.cos(this.angle);

        return {x:this.x, y:this.y};
    }

    calcAirVelocity() {
        let startX = this.length/100 * Math.sin(this.angle);
        let endX = this.length/100 * Math.sin(this.angle + this.angularVelocity);

        let startY = this.length/100 * Math.cos(this.angle);
        let endY = this.length/100 * Math.cos(this.angle + this.angularVelocity);
        
        let xWind = endX - startX + this.cradle.windSpeed;
        let yWind = endY - startY;

        let speed = Math.sqrt(Math.pow(xWind, 2) + Math.pow(yWind, 2));
        let angle = Math.PI - Math.atan(xWind / yWind);

        return {speed, angle};
    }

    calcDragAngularAcceleration() {
        let airVelocity = this.calcAirVelocity();
        let bobProjectedArea = Math.PI * Math.pow(this.bobRadius/100, 2);
        let dragForce =  this.cradle.dragCoefficient * ((this.cradle.airDensity * Math.pow(airVelocity.speed,2))/2) * bobProjectedArea;
        let dragAcceleration = dragForce/this.mass;
        let dragAccelerationAngle = -(Math.PI - airVelocity.angle);

        return dragAcceleration * Math.cos(dragAccelerationAngle)
    }

    calcPontentialAngularAcceleration() {
        return -1 * (this.gravity/(this.length/100)) * Math.sin(this.angle);
    }

    refresh() {
        let angle = 0;

        this.angularAcceleration = this.calcPontentialAngularAcceleration() - this.calcDragAngularAcceleration(); 
        this.angularVelocity += this.angularAcceleration/this.fps;

        this.calcDragAngularAcceleration();

        angle = this.angle + this.angularVelocity/ this.fps;

        // Correct for sampling errors in acceleration;
        if (angle > Math.PI/2) angle =  Math.PI/2;
        if (angle < -Math.PI/2) angle = -Math.PI/2;

        this.bobCordinates();
        this.sampleTime = Date.now();

        this.angle = angle;
    }

    start() {
        let timeFrame = 1000/this.fps;

        this.refreshIntervalId = setInterval(this.refresh.bind(this), timeFrame);
    }

    stop() {
        clearInterval(this.refreshIntervalId);
    }

    getData() {
        return {
            angle: this.angle,
            sampleTime: this.sampleTime,
            x: this.x,
            y: this.y,
        }
    }
}

module.exports.Pendulum = Pendulum;