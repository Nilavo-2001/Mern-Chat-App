const express = require('express');
const { protect } = require('../middlewares/authUser');
const { sendMessage, getMessages } = require('../controllers/messageController');
const router = express.Router();

router.post('/', protect, sendMessage);
router.get('/:chatId', protect, getMessages)

module.exports = router;