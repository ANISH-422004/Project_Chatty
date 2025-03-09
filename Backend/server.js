const env = require("dotenv").config() // Import the dotenv package and call the config method on it
const app = require("./src/app")
const config = require("./src/config/config");

const server = require("http").createServer(app);
const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "*", // Change this to frontend URL in production
        methods: ["GET", "POST"],
    },
});

// Handle Socket.IO Connections
io.on("connection", (socket) => {
    socket.on("setUp", (user) => {
        console.log(`User connected with ID: ${user._id}`);
        socket.join(user._id);
    });

    socket.on("JoinChat", (room) => {
        socket.join(room);
        console.log(`User joined room ${room}`);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"))

    socket.on("newMessage", (newMessage) => {
        const chat = newMessage.chatId;
        if (!chat.users) return console.log("chat.users not defined");

        chat.users.forEach((user) => {
            if (user._id !== newMessage.sender._id) {
                io.to(user._id).emit("messageRecived", newMessage);
            }
        });
    });
});

// Start server
server.listen(config.PORT, () => {
    console.log(`Server is running`);
});


const connectDB = require("./src/db/db")()