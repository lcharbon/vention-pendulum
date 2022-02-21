import settings from "../../settings/settings.json"
import Pendulum from "../../models/Pendulum";
import GeneralControls from "./views/GeneralControls";

let pendulums = {};

function start(opt) {
    console.log("start");
    console.log(opt);
}

function stop() {
    console.log("stop");
}

function init() {
    // Need to wait for content load to set this.
    Pendulum.cradleDOM = globalThis.document?.getElementById("cradle");
    GeneralControls.generalControlsDOM = globalThis.document?.getElementById("general-controls");

    let generalControls = new GeneralControls({
        onStart: start,
        onStop: stop
    });
   
    generalControls.render();
   
    // Creates the amount of pendulums defined in the settings.
    Array.from(Array(settings.pendulumCount)).forEach((undefined, i) => {
        let pendulumId = `pendulum_${i + 1}`
        let pendulum = new Pendulum({pendulumId});

        pendulums[pendulumId] = pendulum;
        pendulum.render();
    });

    // Compute pivot coordinates after all pendulums are rendered.
    Object.values(pendulums).forEach((pendulum)=> pendulum.computePivotDOMCoordinates());

    Object.values(pendulums)[0].start();

    
}

document.addEventListener("DOMContentLoaded", init);