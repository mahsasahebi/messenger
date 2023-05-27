const UserModel = require("../../models/UserModel");
const ChatroomModel = require("../../models/ChatroomModel");


module.exports = new class ChatroomController {

async createPvChatroom(req,res) {
    
    let existPvChatroom = await ChatroomModel.findOne({$and:[{members:req.body.anotherUserId} , {members:req.body.thisUserId}]});
    console.log(existPvChatroom);
    
    if (existPvChatroom) {
        return res.status(200).send({message : "چت روم قبلا ایجاد شده است" , chatroomId: existPvChatroom._id });
    }
    //let anotherUser = await UserModel.findById(req.body.anotherUserId).select({ name: 1 });
    //console.log(anotherUser, anotherUser.name);
    const newPvChatroom = new ChatroomModel({
        type: "PV",
        members: [req.body.thisUserId, req.body.anotherUserId],
        title: ""
    });
    const createdChatroom = await newPvChatroom.save();
    console.log("PV chatroom created", createdChatroom);
    if(createdChatroom)
        return res.status(200).send({message : "چت روم با موفقیت ایجاد شد"});
    else
        return res.status(500).send({ message: "خطایی سمت سرور اتفاق افتاده است" });

}
//createPvChatroom("64626fd1d7b6aa16fabe1085","646272ccb1d7db90ecfff9b8");

}