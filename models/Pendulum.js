class Pendulum {
    static cradleDOM;

    dragging = false;
    pivotX = 0;
    pivotY = 0;
    
    constructor(data) {
        this.id = data.pendulumId;
    }

    #bobDragHandler() {
        this.dragging = true;
        this.giudeDOM.style.opacity = 0.3;

        function onMouseMove(event) {
            let opppsite = this.pivotX - event.pageX;
            let adjacent = event.pageY - this.pivotY;

            console.log(`x: ${this.pivotX}, ${this.pivotY}`);

            // Avoids divide by 0 and bob being above the guide.
            if (adjacent <= 0) return; 

            this.angle = Math.atan(opppsite/adjacent);
            this.pendulumDOM.style.transform = `rotate(${this.angle}rad)`;
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
        this.pendulumControlsDOM = document.createElement("div");
        this.pendulumControlsDOM.classList.add("pendulum-controls");
        
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
        this.pendulumContainerDOM = document.createElement("div");
        this.pendulumContainerDOM.classList.add("pendulum-container");
        this.pendulumContainerDOM.setAttribute("id", this.id);

        this.giudeDOM = document.createElement("div");
        this.giudeDOM.classList.add("guide");
 
        this.pendulumContainerDOM.appendChild(this.giudeDOM);
        this.pendulumContainerDOM.appendChild(this.#renderControls());
        this.pendulumContainerDOM.appendChild(this.#renderPendulum());
        
        
        this.constructor.cradleDOM.appendChild(this.pendulumContainerDOM);
    }
}




export default Pendulum