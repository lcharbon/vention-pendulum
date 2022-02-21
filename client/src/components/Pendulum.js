import InputControl from "./InputControl";
import textStrings from "../../../textStrings.json";

class Pendulum {
    static cradleDOM;
    angle = 1;
    active = false;
    controlsEnabled = true;
    dragging = false;
    refreshIntervalId = 0;
    sampleTime = 0;
   
    angle = 1;
    pivotX = 0;
    pivotY = 0;
    fps = 10;
    length = 0;
    mass = 0;
    bobRadius = 0;
    refreshIntervalId = 0;
    
    constructor(opt={}) {
        this.id = opt.pendulumId;
    }

    async refresh() {
        let requestParams = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };
    
        let response = await fetch('http://localhost:8080/pendulum', requestParams);
        let data = await response.json()

        if (data.sampleTime < this.sampleTime) return;

        this.sampleTime = data.sampleTime;
        this.setAngle(data.angle);
    }

    async sendOptions() {
        let requestParams = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                angle: this.angle,
                pivotX: this.pivotX,
                length: this.length,
                mass: this.mass,
                bobRadius: this.bobRadius
            })
        };
    
        let response = await fetch('http://localhost:8080/pendulum', requestParams);
    }

    async start() {
        this.disableControls();
        
        await this.sendOptions();

        this.active = true;

        this.refreshIntervalId = setInterval(this.refresh.bind(this), 1000/this.fps);
    }

    stop() {
        clearInterval(this.refreshIntervalId);
        this.enableControls();
        this.active = false;
    }

    setAngle(angle=0) {
        let rodAngle = -angle;

        if (angle > Math.PI/2 ||  angle < -Math.PI/2) {
            alert(textStrings["9"]);
            return;
        }
        
        this.angle = angle;
        this.angleControl.setValue(+this.angle.toFixed(4));

        this.pendulumDOM.style.transform = `rotate(${rodAngle}rad)`;
    }

    setLength(length=350) {
        let bobHeight = 72;
        
        if (length > 400) {
            alert(textStrings["8"]);
            return;
        }

        this.length = length;
        this.lengthControl.setValue(length);
        this.pendulumDOM.style.height = length+"px";
        this.giudeDOM.style.height = length + bobHeight/2 + "px";
        this.giudeDOM.style.width = 2 * (length + bobHeight/2) + "px";
    }

    setMass(mass=20) {
        this.mass = mass;
        this.massControl.setValue(mass);
    }

    setBobRadius(radius=36) {
        if (radius > 75 || radius <= 0) {
            alert(textStrings["11"]);
            return;
        }

        this.bobDOM.style.width = 2 * radius + "px";
        this.bobDOM.style.height = 2 * radius + "px";

        this.bobRadius = radius;
        this.bobRadiusControl.setValue(radius);
    }

    #bobDragHandler() {
        if (!this.controlsEnabled) return;
        
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

            this.setAngle(-rodAngle);
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

        this.massControl = new InputControl({
            label: textStrings["3"],
            onChange: this.setLength.bind(this)
        });;

        this.bobRadiusControl = new InputControl({
            label: textStrings["10"],
            onChange: this.setBobRadius.bind(this)
        });;
        
        this.pendulumControlsDOM = document.createElement("div");
        this.pendulumControlsDOM.classList.add("pendulum-controls");
        
        this.pendulumControlsDOM.appendChild(this.angleControl.render());
        this.pendulumControlsDOM.appendChild(this.lengthControl.render());
        this.pendulumControlsDOM.appendChild(this.massControl.render());
        this.pendulumControlsDOM.appendChild(this.bobRadiusControl.render());
        
        return this.pendulumControlsDOM;
    }

    computePivotDOMCoordinates() {
        let elemRect = this.rodDOM.getBoundingClientRect();

        this.pivotX = elemRect.left + (elemRect.width /2) + (window.pageXOffset || document.documentElement.scrollLeft);
        this.pivotY = elemRect.top + (window.pageYOffset || document.documentElement.scrollTop);
    }

    disableControls() {
        this.controlsEnabled = false;
        
        this.angleControl.disable();
        this.lengthControl.disable();
        this.massControl.disable();
        this.bobRadiusControl.disable();
    }

    enableControls() {
        this.controlsEnabled = true;
        
        this.angleControl.enable();
        this.lengthControl.enable();
        this.massControl.enable();
        this.bobRadiusControl.enable();
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
        
        this.setAngle();
        this.setLength();
        this.setMass();
        this.setBobRadius();

        this.constructor.cradleDOM.appendChild(this.mainDOM);

        return this.mainDOM;
    }
}

export default Pendulum