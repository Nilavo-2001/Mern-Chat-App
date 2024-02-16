const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/Chat");
const User = require("../models/User");
const Message = require("../models/Message");

const addAnony = expressAsyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    if (!chatId || !userId) {
        return res.status(400).send("chat id and user id needed");
    }
    const chat = await Chat.findByIdAndUpdate(chatId, { $push: { anony: userId } }, { new: true });
    if (!chat) {
        return res.status(404).send("Chat not Found");
    }
    return res.status(200).json({
        msg: "anony added sucessfully"
    });
})

const removeAnony = expressAsyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    if (!chatId || !userId) {
        return res.status(400).send("chat id and user id needed");
    }
    const chat = await Chat.findByIdAndUpdate(chatId, { $pull: { anony: userId } }, { new: true });
    if (!chat) {
        return res.status(404).send("Chat not Found");
    }
    return res.status(200).json({
        msg: "anony removed sucessfully"
    });
})

const checkAnony = expressAsyncHandler(async (req, res) => {
    const { chatId } = req.params;
    if (!chatId) {
        return res.status(400).send("chat id and user id needed");
    }
    const chat = await Chat.findById(chatId);
    if (!chat) {
        return res.status(404).send("Chat not Found");
    }
    return res.status(200).json({
        anony: chat.anony
    });
})

module.exports = { addAnony, removeAnony, checkAnony }