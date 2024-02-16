const express = require('express');
const { acessChats, fetchChats, createGroupChat, renameGrp, removeFromGroup, addToGroup } = require('../controllers/chatsController');
const { protect } = require('../middlewares/authUser');
const router = express.Router();
router.post("/", protect, acessChats);  // acess or create if not present a one-one chat with the given user and current user
router.get("/", protect, fetchChats); // fetch all the chats that the user is involved with
router.post("/group", protect, createGroupChat);//create a grp chat with given users and setting the current user as admin
router.put("/rename", protect, renameGrp); // rename a grp chat
router.put("/groupremove", protect, removeFromGroup);
router.put("/groupadd", protect, addToGroup);
router.use("/anony", require('./anony'));
module.exports = router;
