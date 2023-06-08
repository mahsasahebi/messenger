const UserModel = require('../../models/UserModel');
const { loginValidator, registerValidator } = require('../../http/validators/UserValidator');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const { Aggregate } = require('mongoose');
const path = require('path');
const fs = require('fs');
const cookieParser = require("cookie-parser");




module.exports = new class UserController {


    root(req,res){
       
        console.log("welcome");
        return res.send(fs.readFileSync(path.join(__dirname, '../../../views', 'index.html')));
    }





    async register(req, res) {
        console.log(req.body);
        const { error } = registerValidator(req.body);
        if (error)
            return res.status(400).send({ message: error.message });

        let user = await UserModel.findOne({ mobile: req.body.mobile });
        if (user)
            return res.status(400).send({ message: "این کاربر قبلا ثبت نام کرده است" });



        const salt = await bcrypt.genSalt(10);
        // console.log(salt);
        const newPass = await bcrypt.hash(req.body.password, salt);
        //console.log(newPass);

        console.log(newPass);
        let newUser = new UserModel({
            name: req.body.name,
            mobile: req.body.mobile,
            password: newPass
        });
        user = await newUser.save();
        const data = {
            _id: user._id,
            name: user.name,
            mobile: user.mobile
        };
        const token = jwt.sign(data, config.get("jwtPrivateKey"));
        console.log(token);
        return res.cookie("x-auth-token", token).status(200).send({ message: "ثبت نام با موفقیت انجام شد" });
    }





    async login(req, res) {
        const { error } = loginValidator(req.body);
        if (error)
            return res.status(400).send({ message: error.message });

        let user = await UserModel.findOne({ mobile: req.body.mobile });
        //console.log(user._id);
        if (!user)
            return res.status(400).send({ message: "کاربری با این مشخصات یافت نشد" });
        const result = await bcrypt.compare(req.body.password, user.password);
        if (!result)
            return res.status(400).send({ message: "کاربری با این مشخصات یافت نشد" });
        const data = {
            _id: user._id,
            name: user.name,
            mobile: user.mobile
        };
        const token = jwt.sign(data, config.get("jwtPrivateKey"));
        console.log(token);
        const response = await fetch(`http://localhost:3000/getChats/?userId=${user._id}`,{mode: 'no-cors'});
        const chats = await response.json();
        

        console.log(chats);
        return res.cookie("x-auth-token", token).status(200).send({ message: "ورود با موفقیت انجام شد" , chats: chats});
    }

async getChats(req,res){
    console.log(req.query.userId);
    const chats = await MessageModel.find({}, { _id: 0, created_at: 1 })
            .populate({ path: "chatroomId", match: { members: req.query.userId } })
            .sort({ "created_at": -1 });
        console.log(chats);
        const chatlist = [];
        let chatroom;
        let memberId;
        let mobileObj;
        let mobile;
        let contacts;
        let flag;
        let user = await UserModel.findOne({ _id: req.query.userId });
        for (let i = 0; i < chats.length; i++) {
            flag = 0;
            chatroom = chats[i].chatroomId;
            console.log(chatroom);

            if (chatroom != null) {
                for (let j = 0; j < 2; j++) {

                    if (String(chatroom.members[j]) != String(req.query.userId)) {

                        memberId = chatroom.members[j];
                        mobileObj = await UserModel.findOne({ _id: memberId }, { _id: 0, mobile: 1 });
                        mobile = mobileObj.mobile;
                        console.log(mobile);
                        contacts = user.contacts;

                        for (let k = 0; k < contacts.length; k++) {

                            if (contacts[k].mobile == mobile) {
                                flag = 1;
                                if(!chatlist.includes(contacts[k].name)){
                                    chatlist.push(contacts[k].name);
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            else
                continue;
            console.log(flag);
            if ((flag == 0) && (!chatlist.includes(mobile))) {
                chatlist.push(mobile);

            }
        }
        return res.status(200).json({ message: "لیست چت ها با موفقیت دریافت شد", chatLength: chatlist.length, chats: chatlist });
}


async getContacts(req,res){
    const contactsObj = await UserModel.findOne({_id : req.body.userId},{contacts:1 , _id:0});
    console.log(contactsObj);
    if(contactsObj.contacts)
        return res.status(200).send({contacts: contactsObj.contacts});
    else
        return res.status(200).send({message : "هیچ مخاطبی موجود نیست"});
}



    async createContact(req, res) {
        const foundUser = await UserModel.find({ mobile: req.body.mobile });
        console.log("foundUser is:", foundUser);
        if (foundUser.length <= 0) {
            console.log("This mobile didn't register");
            res.status(400).send({ message: "این موبایل در پیامرسان ثبت نام نکرده است" });

        }
        else {

            const matchedContacts = await UserModel.find({ _id: req.body.userId, contacts: { $elemMatch: { mobile: req.body.mobile } } }).count();
            let condition;
            console.log(matchedContacts);
            if (matchedContacts > 0)
                condition = true;
            else
                condition = false;
            console.log(condition);
            if (condition) {
                console.log("contact exists");
                return res.status(400).send({ message: "مخاطب تکراری است" });

            }

            else {
                const user = await UserModel.findById(req.body.userId);
                user.contacts.push({ name: req.body.name, mobile: req.body.mobile });
                const savedUser = await user.save();
                if (savedUser) {
                    console.log("contact created...");
                    return res.status(200).send({ message: "مخاطب با موفقیت ایجاد شد" });
                }
                else
                    return res.status(500).send({ message: "خطایی سمت سرور اتفاق افتاده است" });



            }

        }



    }



    async editContact(req, res) {

        const result = await UserModel.updateOne(
            { _id: req.body.userId, contacts: { $elemMatch: { _id: req.body.contactId } } },
            { $set: { "contacts.$.name": req.body.name, "contacts.$.mobile": req.body.mobile } });

        console.log(result);
        if (result.acknowledged) {
            return res.status(200).send({ message: "مخاطب با موفقیت ویرایش شد" });
        }
        else {
            return res.status(500).send({ message: "خطایی سمت سرور اتفاق افتاده است" });
        }

    }
    



    async removeContact(req, res) {
        const selectedUser = await UserModel.findOne({ _id: req.body.userId });
        console.log(selectedUser);
        //const contacts = selectedUser.contacts;
        const result = await selectedUser.contacts.pull({ _id: req.body.contactId });
        console.log(result);
        const removedContact = await selectedUser.save();
        if (removedContact) {
            console.log("contact deleted");
            return res.status(200).send({ message: "مخاطب با موفقیت حذف شد" });
        }
        else
            return res.status(500).send({ message: "خطایی سمت سرور اتفاق افتاده است" });

    }



}





