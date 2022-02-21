import settings from "../../settings/settings.json"
import Pendulum from "../../models/Pendulum";
import GeneralControls from "./views/GeneralControls";

let pendulums = {};
let active = false;

async function start(opt) {
    active = true;

    let requestParams = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            active: true,
            maxWind: generalControls.maxWind,
            dragCoefficient: generalControls.dragCoefficient,
            airDensity: generalControls.airDensity
        })
    };

    let response = await fetch('http://localhost:8080/cradle', requestParams)
    let data = await response.json()

    
    // Object.values(pendulums).forEach((pendulum, i) => {
    //     pendulum.start({
    //         port: 8080 + i + 1
    //     });
    // });

    generalControls.setWindSpeed(data.windSpeed);

    Object.values(pendulums)[0].start({
        port: 8080
    });
}

async function stop() {
    active = false;

    let requestParams = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            active: false,
        })
    };

    let response = await fetch('http://localhost:8080/cradle', requestParams);

    Object.values(pendulums).forEach((pendulum) => pendulum.stop());

    generalControls.setWindSpeed(0);
}


let generalControls = new GeneralControls({
    onStart: start,
    onStop: stop
});


function init() {
    // Need to wait for content load to set this.
    Pendulum.cradleDOM = globalThis.document?.getElementById("cradle");
    GeneralControls.generalControlsDOM = globalThis.document?.getElementById("general-controls");
   
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
}

document.addEventListener("DOMContentLoaded", init);