const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/Chat");
const User = require("../models/User");
const Message = require("../models/Message");


const acessChats = expressAsyncHandler(async (req, res) => {
    //console.log("I am called :acessChats");
    const userId = req.body.userId;
    if (!userId) {
        return res.status(400).send("UserId not found");
    }
    const chat = await Chat.findOne({
        $and: [
            { isGroupChat: false },
            { users: { $elemMatch: { $eq: userId } } },
            { users: { $elemMatch: { $eq: req.user._id } } }
        ]
    }).populate({
        path: "users",
        select: "-password"
    }).populate({
        path: "latestMessage",
        populate: {
            path: "sender",
            select: "name pic email"
        }
    });

    if (chat) {
        return res.send(chat);
    }
    else {
        const newChat = await Chat.create(
            {
                chatName: "sender",
                isGroupChat: false,
                users: [userId, req.user._id],
            }
        )

        // const message = await Message.create({
        //     sender: "6508976a6347955262b7d41e",
        //     content: "You can do it",
        //     chat: newChat._id
        // })

        // newChat.latestMessage = message._id;

        // await newChat.save();

        const reqChat = await Chat.findById(newChat._id).populate({
            path: "users",
            select: "-password"
        })
        return res.status(200).json(reqChat)
    }

})

const fetchChats = expressAsyncHandler(async (req, res) => {
    const id = req.user._id;
    const chats = await Chat.find({
        users: { $elemMatch: { $eq: id } }
    }).populate({ path: "users", select: "-password" }).populate({
        path: "latestMessage",
        populate: {
            path: "sender",
            select: "name pic email"
        }
    }).populate({ path: "groupAdmin", select: "-password" }).sort({ updatedAt: -1 });

    return res.status(200).json(chats);

})

const createGroupChat = expressAsyncHandler(async (req, res) => {
    let { users, name } = req.body;
    if (!users || !name) {
        return res.status(400).send("Please Fill all the feilds");
    }

    let reqUsers = JSON.parse(users);
    if (reqUsers.length < 2) {
        return res.status(400).send("Atleast two members required to create a grp")
    }
    let newGrpChat = await Chat.create({
        chatName: name,
        isGroupChat: true,
        users: [...reqUsers, req.user._id],
        groupAdmin: req.user._id
    })

    let finalGrpChat = await Chat.findById(newGrpChat._id)
        .populate({ path: "users", select: "-password" })
        .populate({ path: "groupAdmin", select: "-password" })

    return res.status(200).send(finalGrpChat);


})

const renameGrp = expressAsyncHandler(async (req, res) => {
    const { chatId, name } = req.body;
    if (!chatId || !name) {
        return res.status(400).send("id and name needed");
    }

    const grpChat = await Chat.findByIdAndUpdate(chatId, { chatName: name }, { new: true }).
        populate("users", "-password").
        populate("groupAdmin", "-password");

    //console.log(grpChat, checkGrp);
    if (!grpChat) {
        return res.status(404).send("Chat not Found");
    }

    return res.status(200).json(grpChat);

})

const removeFromGroup = expressAsyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    if (!chatId || !userId) {
        return res.status(400).send("chat id and user id needed");
    }
    const checkGrp = await Chat.findByIdAndUpdate(chatId);
    if (checkGrp.groupAdmin == req.user._id) {
        return res.status(400).send("You are not authorized");
    }
    const grpChat = await Chat.findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true }).
        populate("users", "-password").
        populate("groupAdmin", "-password");

    if (!grpChat) {
        return res.status(404).send("Chat not Found");
    }

    return res.status(200).json(grpChat);
})

const addToGroup = expressAsyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    if (!chatId || !userId) {
        return res.status(400).send("chat id and user id needed");
    }
    const checkGrp = await Chat.findByIdAndUpdate(chatId);
    if (checkGrp.groupAdmin == req.user._id) {
        return res.status(400).send("You are not authorized");
    }
    const grpChat = await Chat.findByIdAndUpdate(chatId, { $push: { users: userId } }, { new: true }).
        populate("users", "-password").
        populate("groupAdmin", "-password");

    if (!grpChat) {
        return res.status(404).send("Chat not Found");
    }

    return res.status(200).json(grpChat);
})

module.exports = { acessChats, fetchChats, createGroupChat, renameGrp, removeFromGroup, addToGroup }