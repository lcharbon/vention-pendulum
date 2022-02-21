class Cradle {
    maxWind = 0;
    windSpeed = 0;
    dragCoefficient = 0;
    airDensity = 0;
    
    constructor(opt) {
        this.maxWind = opt.maxWind;
        this.dragCoefficient = opt.dragCoefficient;
        this.airDensity = opt.airDensity;
        this.windSpeed = opt.windSpeed;

        if (!this.windSpeed) {
            this.#generateRandomWind();
        }
    }

    #generateRandomWind() {
        this.windSpeed = Math.floor(Math.random() * (this.maxWind + 1));

        console.log("Wind speed is: " + this.windSpeed);
    }

    getData() {
        return {
            maxWind: this.maxWind,
            windSpeed: this.windSpeed,
            dragCoefficient: this.dragCoefficient,
            airDensity: this.airDensity
        }
    }
}

module.exports.Cradle = Cradle;