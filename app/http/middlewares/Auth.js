const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
    const token = req.cookie("x-auth-token");
    if (!token)
        res.status(401).send("شما اجازه دسترسی به این دیتا را ندارید");
    try {
        const user = jwt.verify(token, config.get("jwtPrivateKey"));
        req.user = user;
        next();
    } catch (ex) {
        res.status(401).send("...شما اجازه دسترسی به این دیتا را ندارید");
    }
}