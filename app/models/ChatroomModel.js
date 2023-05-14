const mongoose=require("mongoose");

const schemaChatroom = new mongoose.Schema({
    type :{type: String, enum : ['PV','Group','Channel'] , required : true },
    members : {type : [mongoose.Schema.ObjectId], ref:"users" , required : true },
    title : {type : String }
});

ChatroomModel = mongoose.model("chatroom",schemaChatroom);

module.exports = ChatroomModel;