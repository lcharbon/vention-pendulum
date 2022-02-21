import textStrings from "../../../textStrings.json";
import InputControl from "../components/InputControl";
import PrimaryButton from "../components/PrimaryBottom";

class GeneralControls {
    static generalControlsDOM;

    maxWind = 0;
    dragCoefficient = 0;
    airDensity = 0;

    onStart = () => {};
    onStop = () => {};

    constructor(opt={}) {
        this.onStart = opt.onStart;
        this.onStop = opt.onStop;
    }

    startHandler() {
        this.startButton.disable();
        this.maxWindInput.disable();
        this.airDensityInput.disable();
        this.dragCoefficientInput.disable();
        
        this.stopButton.enable();
        
        this.onStart()
    }

    stopHandler() {
        this.startButton.enable();
        this.maxWindInput.enable();
        this.airDensityInput.enable();
        this.dragCoefficientInput.enable();
        this.startButton.enable();

        this.stopButton.disable();

        this.onStop();
    }

    setMaxWind(maxWind=40) {
        this.maxWind = maxWind;
        this.maxWindInput.setValue(maxWind)
    }

    setDragCoefficient(dragCoefficient=0.42) { // Standard for hemisphere.
        this.dragCoefficient = dragCoefficient;
        this.dragCoefficientInput.setValue(dragCoefficient);
    }

    setAirDensity(airDensity=1.225) { // Standard sea level.
        this.airDensity = airDensity;
        this.airDensityInput.setValue(airDensity)
    }
    
    render() {
        this.innerDOM = document.createElement("div");
        this.innerDOM.classList.add("general-controls-inner")
        this.constructor.generalControlsDOM.appendChild(this.innerDOM);

        this.formDOM = document.createElement("div");
        this.formDOM.classList.add("general-controls-form")
        this.innerDOM.appendChild(this.formDOM);

        this.buttonsDOM = document.createElement("div");
        this.buttonsDOM.classList.add("general-controls-buttons")
        this.innerDOM.appendChild(this.buttonsDOM);
        
        
        // Inputs
        this.maxWindInput = new InputControl({
            label: textStrings["7"],
            onChange: this.setMaxWind.bind(this)
        })

        this.dragCoefficientInput = new InputControl({
            label: textStrings["12"],
            onChange: this.setDragCoefficient.bind(this)
        })

        this.airDensityInput = new InputControl({
            label: textStrings["13"],
            onChange: this.setAirDensity.bind(this)
        })

        // Buttons
        this.startButton = new PrimaryButton({
            label: textStrings["4"],
            onClick: this.startHandler.bind(this)
        })

        this.stopButton = new PrimaryButton({
            label: textStrings["5"],
            onClick: this.stopHandler.bind(this)
        })

        this.formDOM.appendChild(this.maxWindInput.render());
        this.formDOM.appendChild(this.dragCoefficientInput.render());
        this.formDOM.appendChild(this.airDensityInput.render());
        this.buttonsDOM.appendChild(this.startButton.render());
        this.buttonsDOM.appendChild(this.stopButton.render());

        this.setMaxWind();
        this.setAirDensity();
        this.setDragCoefficient();

        this.stopButton.disable();

        return this.constructor.generalControlsDOM;
    }
}

export default GeneralControls