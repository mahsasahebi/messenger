async function getPVChat(userId) {
    console.log(userId);
    const chats = await MessageModel.find({}, { _id: 0, created_at: 1 })
        .populate({ path: "chatroomId", match: { members: userId } })
        .sort({ "created_at": -1 })



    console.log(chats);


    const chatlist = [];
    let chatroom;
    let memberId;
    let mobileObj;
    let mobile;
    let contacts;
    let flag = 0;
    let name;

    for (let i = 0; i < chats.length; i++) {
        
        chatroom = chats[i].chatroomId;
        
        if (chatroom != null) {
            
            for (let j = 0; j < 2; j++) {
                
                if (String(chatroom.members[j]) != String(userId)) {
                    
                    memberId = chatroom.members[j];
                    mobileObj = await UserModel.findOne({ _id: memberId }, { _id: 0, mobile: 1 });
                    mobile = mobileObj.mobile;
                    console.log(mobile);

                    name = await UserModel.findOne({  _id: userId, "contacts.mobile":  mobile },{_id:0,"contacts.name":1});
                    console.log(name);
                    user = await UserModel.findOne({ _id: userId });
                    contacts = user.contacts;

                    console.log(contacts);
                    // console.log(contacts.length);


                   
                    for (let k = 0; k < contacts.length; k++) {

                        if (contacts[k].mobile == mobile) {
                            chatlist.push(contacts[k].name);
                            break;
                        }
                        
                        
                        
                    }
                        
                        chatlist.push(mobile);
                        

                    
                        







                }
            }
        }



    }

    
       
    console.log(chatlist);
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
module.exports = getPVChat;