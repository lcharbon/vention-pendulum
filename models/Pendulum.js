import InputControl from "../client/src/components/InputControl";
import textStrings from "../textStrings.json";

class Pendulum {
    static cradleDOM;

    angle = 0;
    dragging = false;
    pivotX = 0;
    pivotY = 0;
    
    constructor(opt={}) {
        this.id = opt.pendulumId;
    }

    setAngle(angle=Math.PI/2) {
        let rodAngle = Math.PI/2 -angle;
        
        this.angle = angle;
        this.angleControl.setValue(+this.angle.toFixed(4));

        this.pendulumDOM.style.transform = `rotate(${rodAngle}rad)`;
    }

    setLength() {
        console.log("length change");
    }

    #bobDragHandler() {
        this.dragging = true;
        this.giudeDOM.style.opacity = 0.3;

        function onMouseMove(event) {
            let rodAngle = 0;
            let opppsite = this.pivotX - event.pageX;
            let adjacent = event.pageY - this.pivotY;


            // Avoids divide by 0 and bob being above the guide.
            if (adjacent <= 0) {
                if (opppsite > 0) rodAngle = Math.PI/2;
                else rodAngle = -Math.PI/2;
            } else {
                rodAngle = Math.atan(opppsite/adjacent);
            }

            this.setAngle(Math.PI/2 - rodAngle);
        };
        onMouseMove = onMouseMove.bind(this);

        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            this.giudeDOM.style.opacity = 0;
            this.bobDOM.onmouseup = null;
            this.dragging = false;
        }
        onMouseUp = onMouseUp.bind(this);

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp)
    }

    #renderControls() {
        this.angleControl = new InputControl({ 
            label: textStrings["1"],
            onChange: this.setAngle.bind(this)
        });
        this.lengthControl = new InputControl({
            label: textStrings["2"],
            onChange: this.setLength.bind(this)
        });;
        
        this.pendulumControlsDOM = document.createElement("div");
        this.pendulumControlsDOM.classList.add("pendulum-controls");
        
        this.pendulumControlsDOM.appendChild(this.angleControl.render());
        this.pendulumControlsDOM.appendChild(this.lengthControl.render());
        
        return this.pendulumControlsDOM;
    }

    computePivotDOMCoordinates() {
        let elemRect = this.rodDOM.getBoundingClientRect();

        this.pivotX = elemRect.left + (elemRect.width /2) + (window.pageXOffset || document.documentElement.scrollLeft);
        this.pivotY = elemRect.top + (window.pageYOffset || document.documentElement.scrollTop);
    }
    
    #renderPendulum() {
        this.pendulumDOM = document.createElement("div");
        this.pendulumDOM.classList.add("pendulum");

        this.rodDOM = document.createElement("div");
        this.rodDOM.classList.add("rod");
        this.pendulumDOM.appendChild(this.rodDOM);

        this.bobDOM = document.createElement("div");
        this.bobDOM.classList.add("bob");
        this.bobDOM.onmousedown = this.#bobDragHandler.bind(this);
        this.pendulumDOM.appendChild(this.bobDOM);

        return this.pendulumDOM;
    }
    
    render() {
        this.mainDOM = document.createElement("div");
        this.mainDOM.classList.add("pendulum-main");
        this.mainDOM.setAttribute("id", this.id);

        this.giudeDOM = document.createElement("div");
        this.giudeDOM.classList.add("guide");
 
        this.mainDOM.appendChild(this.giudeDOM);
        this.mainDOM.appendChild(this.#renderControls());
        this.mainDOM.appendChild(this.#renderPendulum());
        
        this.setAngle(Math.PI/2);
        this.constructor.cradleDOM.appendChild(this.mainDOM);

        return this.mainDOM;
    }
}

export default Pendulum