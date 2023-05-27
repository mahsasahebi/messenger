const MessageModel = require("../../models/MessageModel");


module.exports = new class MessageController {

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

//createTextMessage("khoobi?","646272ccb1d7db90ecfff9b8","64668c96a18790707b10e452");

}