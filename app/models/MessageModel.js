const mongoose=require("mongoose");

const schemaMessage = new mongoose.Schema({
    text : {type : String},
    type : {type : String, enum : ['text','image','video'], required : true},
    userId : {type : mongoose.Schema.ObjectId ,ref: "users", required : true},
    chatroomId : {type : mongoose.Schema.ObjectId ,ref:"chatroom", required : true},
    created_at : {type : Date , default : Date.now()}

});

MessageModel = mongoose.model("message",schemaMessage);

module.exports = MessageModel;