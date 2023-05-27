const express = require('express');

const router = express.Router();
const Auth = require("../http/middlewares/Auth");
const ChatroomController = require('../http/controllers/ChatroomController');




router.post('/createPvChatroom', Auth , ChatroomController.createPvChatroom);





module.exports = router;