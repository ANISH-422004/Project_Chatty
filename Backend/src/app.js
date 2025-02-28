const express  = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');



// Settings
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));


// Routes



module.exports = app;