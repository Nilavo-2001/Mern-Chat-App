const express = require('express');
const { protect } = require('../middlewares/authUser');
const { sendMessage, getMessages, updateMessage } = require('../controllers/messageController');
const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/:chatId', protect, getMessages)
router.put('/update', protect, updateMessage);

module.exports = router;