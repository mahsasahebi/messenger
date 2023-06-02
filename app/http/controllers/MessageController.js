const MessageModel = require("../../models/MessageModel");


module.exports = new class MessageController {

async getMessages(req,res){
    const messages = await MessageModel.find({chatroomId : req.body.chatroomId},{text:1 , userId:1, _id:0});
    console.log(messages);
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