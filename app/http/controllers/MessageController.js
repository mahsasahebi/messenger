const MessageModel = require("../../models/MessageModel");
const ChatroomModel = require("../../models/ChatroomModel");
const { Aggregate } = require('mongoose');

module.exports = new class MessageController {

async getMessages(req,res){
    const userId=req.query.userId;
    const contactId=req.query.contactId;
    console.log(userId,"-",contactId);
    const chatroomIdObj=await ChatroomModel.findOne({$and: [{members:userId},{members:contactId}]},{_id:1});
    
    const chatroomId = chatroomIdObj._id;
    console.log(chatroomIdObj);
    console.log(chatroomId);
   

    const messages = await MessageModel.find({chatroomId : chatroomId},{text:1 , userId:1, _id:0});
    //console.log(messages);
    if(messages.length > 0)
         return res.status(200).send({message: messages});
    else
         return res.status(200).send({message: "هیچ پیامی موجود نیست"});
}

async  createTextMessage(req,res) {
    const newMessage = new MessageModel({
        text: req.body.text,
        type: 'text',
        userId: req.body.userId,
        chatroomId: req.body.chatroomId
    });
    const createdMessage = await newMessage.save();
    console.log("message created", createdMessage);
    if(createdMessage)
        return res.status(200).send({message: "پیام با موفقیت ایجاد شد"});
    else
        return res.status(500).send({ message: "خطایی سمت سرور اتفاق افتاده است" });
    
}


}