const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const router = require('./routes/router');

const app = express();
const port = 40000;
app.use(cors())

app.use(bodyParser.urlencoded({ extended: false, }));
app.use(express.json());

app.use(router);

app.listen(port, () => {
    console.log(`App listening at port ${port}`)
})