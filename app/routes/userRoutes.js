const express=require('express');
const router=express.Router();
const UserModel=require('../models/UserModel');
const {loginValidator,registerValidator} = require('../http/validators/UserValidator');

router.post('/api/register',async(req,res)=>{
    console.log(req.body);
    const { error } = registerValidator(req.body);
    if(error)
        return res.status(400).send({ message : error.message });
    
    let user = await UserModel.findOne({mobile:req.body.mobile});
    if(user)
        return res.status(400).send({message:"این کاربر قبلا ثبت نام کرده است"});

    await register(req.body.name,req.body.mobile,req.body.password);
    return res.status(200).send({message: "ثبت نام با موفقیت انجام شد"});

});

async function register(name, mobile, password) {
    const newUser = new UserModel({
        name: name,
        mobile: mobile,
        password: password
    });
    const savedUser = await newUser.save();
    console.log("user saved", savedUser);

}
//register("tina","09158005984","123");

module.exports = router;