const Chat = require("../models/Chat");
const Message = require("../models/Message");

const expressAsyncHandler = require("express-async-handler");


const sendMessage = expressAsyncHandler(async (req, res) => {
    const { content, chatId } = req.body;
    const userId = req.user._id;
    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.status(400);
    }

    try {

        let message = await Message.create(
            {
                sender: req.user._id,
                content,
                chat: chatId,
                seen: [userId]
            }
        )
        await message.populate({
            path: "sender",
            select: "name pic"
        })
        await message.populate({
            path: "chat",
            populate: {
                path: "users",
                select: "name pic email"
            }
        })

        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: message._id
        })

        return res.status(200).json(message);

    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }



})

const getMessages = expressAsyncHandler(async (req, res) => {
    const { chatId } = req.params;
    const userId = req.user._id;
    try {
        const update = await Message.updateMany({ chat: chatId }, { $addToSet: { seen: userId } });
        const messages = await Message.find({ chat: chatId }).
            populate({ path: "sender", select: "name pic email" }).
            populate({ path: "chat" });
        return res.status(200).json(messages)
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
}
)

const updateMessage = expressAsyncHandler(async (req, res) => {
    const { messageId } = req.body;
    const userId = req.user._id;
    try {
        let message = await Message.findByIdAndUpdate(messageId, { $addToSet: { seen: userId } });
        console.log("update ", message);
        return res.status(200).json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
}
)








module.exports = { sendMessage, getMessages, updateMessage };