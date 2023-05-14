const mongoose = require("mongoose");
const UserModel = require("../app/models/UserModel");
const ChatroomModel = require("../app/models/ChatroomModel");
const MessageModel = require("../app/models/MessageModel");
const express=require("express");
const app = express();
const userRoutes= require("./routes/userRoutes");



class Application {
    constructor() {
        this.setupExpressServer();
        this.setupMongoose();
        this.setupRoutesAndMiddlewares();
    }
    
    setupExpressServer() {
        const port = 3000;
        app.listen(port, (err) => {
            if (err) console.log(err);
            else console.log(`app is listening port: ${port}`);
        });
    }

    setupMongoose() {
        mongoose.connect('mongodb://127.0.0.1:27017/messenger')
            .then(() => {
                console.log("db connected...");
            }).catch((err) => {
                console.log("db not connected...", err);
            });
    }

    setupRoutesAndMiddlewares(){
        app.use(express.json());
        app.use(userRoutes);
    }

}









async function createPvChatroom(thisUserId, anotherUserId) {
    let anotherUser = await UserModel.findById(anotherUserId).select({ name: 1 });
    console.log(anotherUser, anotherUser.name);
    const newPvChatroom = new ChatroomModel({
        type: "PV",
        members: [thisUserId, anotherUserId],
        title: anotherUser.name
    });
    const createdChatroom = await newPvChatroom.save();
    console.log("PV chatroom created", createdChatroom);

}
//createPvChatroom("64500e9eb1f35f844d5f6125","64500f4eb1f35f844d5f6129");

async function createTextMessage(text, userId, chatroomId) {
    const newMessage = new MessageModel({
        text: text,
        type: 'text',
        userId: userId,
        chatroomId: chatroomId
    });
    const createdMessage = await newMessage.save();
    console.log("message created", createdMessage);
}

//createTextMessage("salam","64500e9eb1f35f844d5f6125","645a592c228e7a511bc28c46");

async function createContact(userId, name, mobile) {
    const foundUser = await UserModel.find({ mobile: mobile });
    console.log("foundUser is:", foundUser);
    if (foundUser.length <= 0) {
        console.log("This mobile didn't register");
        process.exit();
    }
    else {
        const condition = await isContact(userId, mobile);
        console.log(condition);
        if (condition) {
            console.log("contact exists");
            process.exit();
        }

        else {
            const user = await UserModel.findById(userId);
            user.contacts.push({ name: name, mobile: mobile });
            await user.save();
            console.log("contact created");
            process.exit();
        }

    }



}

async function isContact(userId, mobile) {
    const matchedContacts = await UserModel.find({ _id: userId, contacts: { $elemMatch: { mobile: mobile } } }).count();

    console.log(matchedContacts);
    if (matchedContacts > 0)
        return true;
    else
        return false;
}


//createContact("64595424fbfce9e0b7873374","mahshid","09155037651");


async function removeContact(userId, contactId) {
    const selectedUser = await UserModel.findById(userId);
    await selectedUser.contacts.pull({ _id: contactId });
    await selectedUser.save();
    console.log("contact deleted");
    process.exit();
}
//removeContact("64595424fbfce9e0b7873374","645bf7372461ccbada67ce7a");


async function editContact(userId, contactId, name, mobile) {

    //const selectedUser = await UserModel.findById(userId);
    const result = await UserModel.updateOne(
        { _id: userId, "contacts._id": contactId },
        { $set: { "contacts.$.name": name, "contacts.$.mobile": mobile } });
    console.log(result);

    process.exit();
}
//editContact("64595424fbfce9e0b7873374","645bf79541d28a32514df9dd","mahshid","09155037651");


module.exports = Application;