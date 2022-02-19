import settings from "../../settings/settings.json"
import Pendulum from "../../models/Pendulum";

const pendulums = {};

function init() {
    // Need to wait for content load to set this.
    Pendulum.cradleDOM = globalThis.document?.getElementById("cradle");
   
    // Creates the amount of pendulums defined in the settings.
    Array.from(Array(settings.pendulumCount)).forEach((undefined, i) => {
        let pendulumId = `pendulum_${i + 1}`
        let pendulum = new Pendulum({pendulumId});

        pendulums[pendulumId] = pendulum;
        pendulum.render();
    });

    // Compute pivot coordinates after all pendulums are rendered.
    Object.values(pendulums).forEach((pendulum)=> pendulum.computePivotDOMCoordinates());

    
}

document.addEventListener("DOMContentLoaded", init);