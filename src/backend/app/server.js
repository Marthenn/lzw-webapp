const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const env = require('dotenv').config();

const routes = require('./routes');

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL
}));

app.use(bodyParser.json());

app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

routes(app);

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
});
