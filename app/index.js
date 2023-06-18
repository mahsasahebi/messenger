const mongoose = require("mongoose");



const express=require("express");
const app = express();
//express.static("../public");
const cors = require("cors");
const userRoutes= require("./routes/userRoutes");
const chatroomRoutes= require("./routes/chatroomRoutes");
const messageRoutes= require("./routes/messageRoutes");
const cookieParser = require("cookie-parser");
const bdp = require('body-parser')



class Application {
    constructor() {
        this.setupRoutesAndMiddlewares();
        this.setupExpressServer();
        this.setupMongoose();
        
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
        app.use(bdp.json())
        app.use(cookieParser());
        app.use(cors());
        app.use(express.urlencoded())
        app.use(express.static(__dirname + '/../public/'));
        app.use(userRoutes);
        app.use(chatroomRoutes);
        app.use(messageRoutes);
    }

}



module.exports = Application;