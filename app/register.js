const hashPass = require("./hashPass");


async function register(name, mobile, password) {
    const newPass = await hashPass(password);
    console.log(newPass);
    let newUser = new UserModel({
        name: name,
        mobile: mobile,
        password: newPass
    });
    return newUser = await newUser.save();
    

}
//register("tina","09158005984","123");

module.exports = register ; 