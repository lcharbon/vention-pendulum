const fork = require('child_process').fork;
const express = require('express');
const axios = require('axios').default;

const settings = require('../settings/settings.json');
const app = express();
const cors = require('cors');

const { Pendulum } = require("./models/Pendulum");
const { Cradle } = require('./models/Cradle');

const PORT = 8080;

// Creates the amount processes for the amount of pendulums defined in the settings.
Array.from(Array(settings.pendulumCount)).forEach((undefined, i) => {
    let port = PORT + i + 1;

    fork("./server/controlers/pendulum.js",{
        env: Object.assign(process.env, { port })
    });
});

let cradle = {};
let pendulum = {};

async function publishCradle(data) {
    let cradlePublishPromises = [];
    
    Array.from(Array(settings.pendulumCount)).forEach((undefined, i) => {
        let port = PORT + 1 + i;
        
        cradlePublishPromises.push(axios.put(`http://localhost:${port}/cradle`, data));
    })

    await Promise.all(cradlePublishPromises);
}

app.use(express.json());
app.use(cors());
app.listen(PORT, () => {});

app.put("/cradle", async (req, res) => {
    if (req.body.active === false) {
        cradle.stop();
        pendulum.stop();
    } else {
        cradle = new Cradle(req.body);
        await publishCradle(cradle.getData())
    }

    res.status(200).send(
        cradle.getData()
    );
});