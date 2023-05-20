const bcrypt = require('bcrypt');

async function hashPass(pass) {
    const salt = await bcrypt.genSalt(10);
   // console.log(salt);
    const newPass = await bcrypt.hash(pass,salt);
    //console.log(newPass);
    return newPass;
}

module.exports = hashPass;