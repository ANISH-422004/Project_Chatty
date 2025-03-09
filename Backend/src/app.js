const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const userRoutes = require('./routes/user.routes');
const chatRoutes = require("./routes/chat.routes")
const messageRoutes = require("./routes/message.routes")
const app = express();

// Middleware setup
app.use(cors());
app.use(morgan('dev')); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/chat' , chatRoutes)
app.use('/api/v1/message',messageRoutes)



module.exports = app;
