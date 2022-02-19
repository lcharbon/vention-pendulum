class PrimaryButton {
    label = "";
    onClick = () => {};
    
    constructor(opt) {
        this.label = opt.label || "";
        this.onClick = opt.onClick;
    }

    clickHandler() {
        this.onClick();
    }

    render() {
        this.mainDOM = document.createElement("div");
        this.mainDOM.classList.add("primary-button-main");

        this.buttonDOM = document.createElement("button");
        this.buttonDOM.classList.add("primary-button");
        this.buttonDOM.textContent = this.label;
        this.buttonDOM.onclick = this.clickHandler.bind(this);
        this.mainDOM.appendChild(this.buttonDOM);


        return this.mainDOM;
    }
}

export default PrimaryButton;