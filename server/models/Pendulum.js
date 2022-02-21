const axios = require("axios").default;
const ipc = require('node-ipc');
const settings = require("../../settings/settings.json");
const EventEmitter = require('events');

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
    initialAngle = 0;

    constructor(opt) {
        this.cradle = opt.cradle;

        this.active = opt.active;
        this.angle = opt.angle;
        this.initialAngle = opt.angle;
        this.pivotX = opt.pivotX;
        this.length = opt.length;
        this.mass = opt.mass;
        this.bobRadius = opt.bobRadius;

        this.listenForStop();
        this.refreshIntervalId = setInterval(this.refresh.bind(this), 1000/this.fps);
    }

    listenForStop() {
        ipc.config.id = 'pendulum' + process.env.port;  // CID = from args
        ipc.config.retry = 1500;

        ipc.connectTo('root', () => {
            ipc.of.root.on('connect', () => {
            });

            ipc.of.root.on('disconnect', () => {
            });

            ipc.of.root.on('kill.connection', (data) => {
                ipc.disconnect('root');
            });

            ipc.of.root.on('stop', (data) => {
                console.log(`client ${process.env.port} received collision`);
                this.stop();

                if (data.collision !== false) {
                    this.angle = this.initialAngle;

                    setTimeout(() => {
                        this.start();
                    }, 5000)
                }
            });
        });
    }

    calcBobCordinates() {
        this.x = this.length * Math.sin(this.angle) + this.pivotX;
        this.y = this.length * Math.cos(this.angle);

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

    detectCollision() {
        let currentPort = parseInt(process.env.port);

        let ports = [currentPort - 1, currentPort + 1]

        function getDistance(x1, y1, x2, y2) {
            let y = x2 - x1;
            let x = y2 - y1;
            
            return Math.sqrt(x * x + y * y);
        }

        ports.forEach(async (port) => {
            if (port == 8080 || port == (8081 + parseInt(settings.pendulumCount)) ) return;
            
            let response = await axios.get(`http://localhost:${port}/pendulum`);

            let distance = getDistance(this.x, this.y, response.data.x, response.data.y);

            if (distance - 2 * this.bobRadius < settings.collisionThreshold) {
                ipc.of.root.emit('stop', {});
            }
        });
    }

    refresh() {
        let angle = 0;

        if (!this.active) return;

        this.angularAcceleration = this.calcPontentialAngularAcceleration() - this.calcDragAngularAcceleration(); 
        this.angularVelocity += this.angularAcceleration/this.fps;

        this.calcDragAngularAcceleration();

        angle = this.angle + this.angularVelocity/ this.fps;

        // Correct for sampling errors in acceleration;
        if (angle > Math.PI/2) angle =  Math.PI/2;
        if (angle < -Math.PI/2) angle = -Math.PI/2;

        this.calcBobCordinates();
        this.detectCollision();
        this.sampleTime = Date.now();

        this.angle = angle;
    }

    start() {        
        this.active = true;
    }

    stop() {
        this.angularVelocity = 0;
        this.active = false;
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