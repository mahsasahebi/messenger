const express = require('express');
const router = express.Router();
const UserController = require('../http/controllers/UserController');
const Auth = require('../http/middlewares/Auth');



router.get('/',UserController.root);

router.post('/register', UserController.register);

router.post('/login', UserController.login);

router.get('/getChatRooms', UserController.getChatRooms);

router.get('/chats',Auth, UserController.chats);

router.get('/getContacts', Auth, UserController.getContacts);

router.post('/createContact', Auth , UserController.createContact);

router.put('/editContact', Auth , UserController.editContact);

router.delete('/removeContact', Auth , UserController.removeContact);



module.exports = router;