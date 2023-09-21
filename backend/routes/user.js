const express = require('express');
const { registerUser, loginUser, searchUsers } = require('../controllers/userControllers');
const { protect } = require('../middlewares/authUser');
const router = express.Router();

router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.post('/search', protect, searchUsers);
module.exports = router;
