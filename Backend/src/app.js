const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const userRoutes = require('./routes/user.routes');
const chatRoutes = require("./routes/chat.routes")
const messageRoutes = require("./routes/message.routes")
const app = express();
const path = require("path")

// Middleware setup
app.use(cors());
app.use(morgan('dev')); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
    res.json({message:"Server is running..."});
  });
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/chat' , chatRoutes)
app.use('/api/v1/message',messageRoutes)


//-------------Deployment---------------

const _dirname1 = path.resolve()
if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(_dirname1, 'FrontEnd', 'dist')))
  app.get("*",(req,res)=>{
    res.sendFile(_dirname1,"FrontEnd","dist","index.html")
  })

}else{
  app.get("/",(req,res)=>{
    res.send("API is Running Successfully")
  })
}

//-------------Deployment---------------






module.exports = app;
