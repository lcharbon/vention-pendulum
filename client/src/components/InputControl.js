class InputControl {
    
    label = "";
    value = "";
    onChange = () => {};
    
    constructor(opt={}) {
       this.label = opt.label;
       this.value = opt.value || "";
       this.onChange = opt.onChange;
    }

    setValue(value) {
        this.value = value;
        this.inputDOM.value = this.value;
    }

    onChangeHandler(event) {
        let value = parseFloat(event.target.value)|| undefined;
        this.onChange(value);
    }
    
    render() {
        this.mainDOM = document.createElement("div");
        this.mainDOM.classList.add("input-control-main");

        this.labelDOM = document.createElement("div");
        this.labelDOM.classList.add("input-control-label");
        this.labelDOM.innerText = this.label;
        this.mainDOM.appendChild(this.labelDOM);

        this.inputDOM = document.createElement("input");
        this.inputDOM.classList.add("input-control-label");
        this.inputDOM.setAttribute("type", "number");
        this.inputDOM.setAttribute("step", "0.01");
        this.inputDOM.onchange = this.onChangeHandler.bind(this);
        this.mainDOM.appendChild(this.inputDOM);

        this.setValue(this.value);

        return this.mainDOM;
    }
}

export default InputControl