const express = require('express');
const router = express.Router();
const UserController = require('../http/controllers/UserController');
const Auth = require('../http/middlewares/Auth');




router.post('/register', UserController.register);

router.get('/login', Auth, UserController.login);

router.post('/createContact', Auth , UserController.createContact);

router.put('/editContact', Auth , UserController.editContact);

router.delete('/removeContact', Auth , UserController.removeContact);



module.exports = router;