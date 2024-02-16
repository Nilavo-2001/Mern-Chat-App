const express = require('express');
const { checkAnony, addAnony, removeAnony } = require('../controllers/anonyController');
const { protect } = require('../middlewares/authUser');
const router = express.Router();

router.get('/check/:chatId', protect, checkAnony);
router.post('/add', protect, addAnony);
router.post('/remove', protect, removeAnony);

module.exports = router;