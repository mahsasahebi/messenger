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
    
    let name;

    for (let i = 0; i < chats.length; i++) {
        flag = 0;
        chatroom = chats[i].chatroomId;
        
        if (chatroom != null) {
            //flag = 0;
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
                    


                   
                    for (let k = 0; k < contacts.length; k++) {

                        if (contacts[k].mobile == mobile) {
                            flag = 1;
                            chatlist.push(contacts[k].name);
                            break;
                        }
                        
                        
                        
                    }
                        
                            
      
                }
                else
                    continue;
            }
        }
        else
            continue;
        console.log(flag);
        if(flag == 0)
            chatlist.push(mobile);

    }

    
       
    console.log(chatlist);
    return chatlist;
}





module.exports = getPVChat;