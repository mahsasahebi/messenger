async function getPVChats(userId) {
    const chats = await ChatroomModel.find({ type: "PV", members: userId });
    console.log = chats;
    const chatlist = [];
    let memberId;
    let mobileObj;
    let phone;
    let name;
    let existContacts;
    for (let i = 0; i < chats.length; i++) {
        for (let j = 0; j < 2; j++) {

            if (String(chats[i].members[j]) != String(userId)) {

                memberId = chats[i].members[j];
                mobileObj = await UserModel.findOne({ _id: memberId },{_id:0,mobile:1});
                mobile=mobileObj.mobile;
                //console.log(phone);
                existContacts = await UserModel.findOne({ _id: userId,  "contacts.mobile" :mobile} ,{_id:0,"contacts.name":1});
                // console.log(existContacts);
                 name = existContacts;
                 
                 if (!name)
                     chatlist.push(phone);

                 else {
                     chatlist.push(name);
                     //console.log(name);
                 }


            }
        }

    }


    //console.log(contacts);

    //console.log(chats);

    return chatlist;
}

// async function getContactName(userId, mobile) {
//     const existContacts = await UserModel.find({ _id: userId, contacts: { $elemMatch: { mobile: mobile } } }, { contacts: { name: 1 }, _id: 0 });
//     let contact = existContacts.name;
//     //let contactName=contact.name;


//     return contact;

// }

// async function cname() {
//     console.log(await getContactName("64626fe5d7b6aa16fabe1088", "09151232765"));
// }
// cname();
module.exports = getPVChats;