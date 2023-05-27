const express = require('express');
const router = express.Router();
const MessageController = require('../http/controllers/MessageController');
const Auth = require("../http/middlewares/Auth");



router.post('/createTextMessage',Auth, MessageController.createTextMessage);





module.exports = router;