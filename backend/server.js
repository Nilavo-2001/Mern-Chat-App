const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require('cors');
const { chats } = require("./data/chat");
const connectDB = require("./config/db")
dotenv.config();
connectDB();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', require('./routes'));
app.use((req, res) => { res.send("URL NOT FOUND") });
const PORT = process.env.PORT;
app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log(`Server running sucessfully on PORT ${PORT}`);
})