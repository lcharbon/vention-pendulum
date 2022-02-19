import textStrings from "../../../textStrings.json";
import InputControl from "../components/InputControl";
import PrimaryButton from "../components/PrimaryBottom";

class GeneralControls {
    static generalControlsDOM;

    onStart = () => {};
    onStop = () => {};

    constructor(opt={}) {
        this.onStart = opt.onStart;
        this.onStop = opt.onStop;
    }

    startHandler() {
        let opt = {
            maxWind: this.maxWind
        }

        this.onStart(opt)
    }

    stopHandler() {
        this.onStop()
    }

    setMaxWind(maxWind=5) {
        this.maxWind = maxWind;
        this.maxWindInput.setValue(maxWind)
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
        this.buttonsDOM.appendChild(this.startButton.render());
        this.buttonsDOM.appendChild(this.stopButton.render());

        this.setMaxWind();

        return this.constructor.generalControlsDOM;
    }
}

export default GeneralControls