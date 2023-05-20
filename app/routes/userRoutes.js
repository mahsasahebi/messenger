const express = require('express');
const router = express.Router();
const UserModel = require('../models/UserModel');
const { loginValidator, registerValidator } = require('../http/validators/UserValidator');
const register = require("../register");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const getPVChat = require("../getPVChat");

router.post('/register', async (req, res) => {
    console.log(req.body);
    const { error } = registerValidator(req.body);
    if (error)
        return res.status(400).send({ message: error.message });

    let user = await UserModel.findOne({ mobile: req.body.mobile });
    if (user)
        return res.status(400).send({ message: "این کاربر قبلا ثبت نام کرده است" });

    user = await register(req.body.name, req.body.mobile, req.body.password);
    const data = {
        _id : user._id ,
        name : user.name,
        mobile : user.mobile
    };
    const token = jwt.sign(data , config.get("jwtPrivateKey"));
    return res.header("x-auth-token",token ).status(200).send({ message: "ثبت نام با موفقیت انجام شد" });

});

router.post('/login', async (req, res) => {
    
    const { error } = loginValidator(req.body);
    if (error)
        return res.status(400).send({ message: error.message });

    let user = await UserModel.findOne({ mobile: req.body.mobile });
    if (!user)
        return res.status(400).send({ message: "کاربری با این مشخصات یافت نشد" });
    const result = await bcrypt.compare(req.body.password,user.password);
    if(!result)
        return res.status(400).send({ message: "کاربری با این مشخصات یافت نشد" });
    const data = {
        _id : user._id ,
        name : user.name,
        mobile : user.mobile
    };
    const token = jwt.sign(data , config.get("jwtPrivateKey"));
    const chats = await getPVChat(user._id);
    return res.header("x-auth-token",token ).status(200).send({message:"ورود با موفقیت انجام شد", chats: chats});

    

});



module.exports = router;