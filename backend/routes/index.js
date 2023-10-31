const express = require('express');
const router = express.Router();

router.use('/user', require('./user'));
router.use('/chat', require('./chat'));
router.use('/message', require('./message'))
module.exports = router;
