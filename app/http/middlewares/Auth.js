const jwt = require("jsonwebtoken");
const config = require("config");
const cookieParser = require("cookie-parser");


module.exports = function (req, res, next) {
    //console.log(req.cookies);
    const token = req.cookies["token"];
    console.log(token);
    if (!token)
        return res.status(401).send("شما اجازه دسترسی به این دیتا را ندارید");
    try {
        const user = jwt.verify(token, config.get("jwtPrivateKey"));
        req.user = user;
        next();
    } catch (ex) {
        return res.status(401).send("...شما اجازه دسترسی به این دیتا را ندارید");
    }
}