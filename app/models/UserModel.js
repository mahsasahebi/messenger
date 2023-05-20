const mongoose = require('mongoose');

const schemaUser = new mongoose.Schema({
    name : {type : String, required : true },
    mobile : {type : String , required : true , unique : true , length : 11 },
    password : {type : String , required : true},
    contacts : {type : [{name: {type : String , required : true } , mobile: {type :String , required : true}}]} 

});

UserModel = mongoose.model("user",schemaUser);

module.exports = UserModel;