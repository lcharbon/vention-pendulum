class Pendulum {
    angle = 1;
    pivotX = 0;
    pivotY = 0; 
    bobX = 0;
    bobY = 0
    length = 350;
    mass = 0;

    getBobX () {
        return this.length * Math.sin(this.angle);
    }

    getBobY() {
        return this.length * Math.cos(this.angle);
    }

    getBobCoordinates() {
        return {
            x: this.getBobX(),
            y: this.getBobY()
        }
    }
}

module.exports.Pendulum = Pendulum;