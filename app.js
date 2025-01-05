/* eslint-disable no-undef */
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

const router = express.Router();

app.use(express.json());

app.use(express.static('public'));

app.use(router);
require('./app/routes')(router);

app.listen(port, () => {
    console.log(`Server Listening on port ${port}`);
})