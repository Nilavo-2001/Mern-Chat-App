const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require("./config/db")
const test = require("./middlewares/testDb");
const path = require("path");
const cron = require('node-cron');

dotenv.config();
connectDB();
app.use(cors());
app.use(express.json());
app.use('/api', require('./routes'));
// --------------------------deployment------------------------------

const __dirname1 = path.resolve();
console.log(process.env.SERVER_ENV);
console.log("running on", process.env.SERVER_ENV);
if (process.env.SERVER_ENV === "production") {
    app.use(express.static(path.join(__dirname1, "/client/build")));

    app.get("*", (req, res) =>
        res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"))
    );
    cron.schedule("*/2 * * * *", function () {
        console.log("running a task every 2 minutes");
    });
} else {
    app.get("/", (req, res) => {
        res.send("API is running..");
    });
}


// --------------------------deployment------------------------------

const PORT = process.env.PORT;
const server = app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
        return;
    }
    //test();
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

    socket.on("activate anony", (data) => {
        const { userId, room } = data;
        console.log("activate anony");
        socket.in(room).emit("anony activated", userId);
    })

    socket.on("stop anony", (data) => {
        const { userId, room } = data;
        console.log("stop anony");
        socket.in(room).emit("anony stopped", userId);
    })





})