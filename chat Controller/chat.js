const Chat = require("../modules/chat.js");
const Expert = require("../modules/expert.js");

//Controller for chat page
module.exports.chatPage = async (req,res) => {
    let userId = req.user.id;
    console.log("UserId: ", userId);
    let {id} =req.params;
    let expert = await Expert.findById(id);
    let chats = await Chat.find({ $or: [{ sender:id }, { receiver: id }] }).populate("sender").populate("receiver");
                            
    // console.log("chats: " , chats);
    if(!expert) {
        req.flash("failure" , "Expert you are searching for is currently unavailable");
        res.redirect("/experts");
    }
    res.render("./experts/chat.ejs",{expert , message: chats , userId});
};

//Controller for saving chat
module.exports.saveChat = async (req, res) => {
    let { id } = req.params; 
    let {message}  = req.body.chat;
    console.log("messages: " , message);
    
    let sender = req.user.id;  
    let receiver = id; 
    
    let chat = new Chat ({ message:message , sender:sender , receiver:receiver});
    await chat.save();
    res.redirect(`/expert/${id}/chat`);
}