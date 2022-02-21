const express = require('express')
const app = express();
const cors = require('cors');
const { Pendulum } = require('../models/Pendulum');
const { Cradle } = require('../models/Cradle');
const PORT = process.env.port;

let cradle = {};
let pendulum = {};

app.use(express.json());
app.use(cors());
app.listen(PORT, () => {
    console.log(`Pendulum listening on port ${PORT}.`)
});

app.put("/cradle", (req, res) => {
    console.log(`cradle received on port ${PORT}`)
    if (req.body.active === false) {
        cradle.stop();
        pendulum.stop();
    } else {
        cradle = new Cradle(req.body);
    }

    res.status(200).send(
        cradle.getData()
    );
});

app.put("/pendulum", (req, res) => {
    let active = req.body.active;

    console.log("pendulum received");
    
    pendulum = new Pendulum({
        cradle,
        ...req.body
    });

    pendulum.start();

    res.send();
})

app.get("/pendulum", (req, res) => {
    res.status(200).send(
        pendulum.getData()
    );
})