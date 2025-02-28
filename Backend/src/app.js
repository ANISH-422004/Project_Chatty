const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const userRoutes = require('./routes/user.routes');

const app = express();

// Middleware setup
app.use(cors());
app.use(morgan('dev')); // Morgan should be defined before routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/user', userRoutes);

module.exports = app;
