const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require("./config/db")
dotenv.config();
connectDB();
app.use(cors());
app.use(express.json());
app.use('/api', require('./routes'));
//app.use((req, res) => { res.send("URL NOT FOUND") });
const PORT = process.env.PORT;
const server = app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log(`Server running sucessfully on PORT ${PORT}`);
})

const io = require('socket.io')(server, {
    pingTimout: 60000,
    cors: {
        origin: "http://localhost:3000"
    },

});

io.on("connection", (socket) => {
    console.log("socket connection established");
    const listener = (userData) => {
        console.log(`${userData.name} joined room`);
        socket.join(userData._id);
        socket.emit("connected")
    }
    socket.on("setup", listener)

    socket.on("join chat", (room) => {
        socket.join(room);
        console.log(`user joined room ${room}`);
    })

    socket.on("new message", (message) => {
        console.log("a user sent a message");
        let chat = message.chat;
        if (!chat.users) return console.log("no users in chat");
        chat.users.forEach(user => {
            if (message.sender._id == user._id) return;
            socket.in(user._id).emit("received message", message);
        });
    })

    socket.on("start typing", (data) => {
        console.log("user started typing");
        const { userId, room } = data;
        socket.in(room).emit("start typing", userId);
    })
    socket.on("stop typing", (room) => {
        console.log("user stopped typing");
        socket.in(room).emit("stop typing");
    })

    socket.on("leave chat", (room) => {
        socket.leave(room);
        console.log(`user left room ${room}`);
        // console.log(socket.rooms);
    })



})