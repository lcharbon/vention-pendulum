const express = require('express')
const app = express();
const cors = require('cors');

const { Pendulum } = require("./models/Pendulum");
const { Cradle } = require('./models/Cradle');

const PORT = 8080;

let cradle = {};
let pendulum = {};

app.use(express.json());
app.use(cors());
app.listen(PORT, () => {});

app.put("/cradle", (req, res) => {
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


// let pendulum = new Pendulum