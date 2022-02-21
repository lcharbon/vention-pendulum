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
    Array.from(Array(settings.pendulumCount)).forEach((undefined, i) => {
        let port = PORT + 1 + i;
        
        axios.put(`http://localhost:${port}/cradle`, data);
    })
}

app.use(express.json());
app.use(cors());
app.listen(PORT, () => {});

app.put("/cradle", (req, res) => {
    if (req.body.active === false) {
        cradle.stop();
        pendulum.stop();
    } else {
        cradle = new Cradle(req.body);
        publishCradle(cradle.getData())
    }

    res.status(200).send(
        cradle.getData()
    );
});