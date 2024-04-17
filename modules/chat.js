const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    // message: {
    //     type: String,
    // },
    // sender: {
    //     type: Schema.Types.ObjectId,
    //     ref: "User",
    // },
    // receiver: {
    //     type: Schema.Types.ObjectId,
    //     ref: "Expert",
    // },
    message: {
        type: String,
    },
    sender: {
        type: Schema.Types.ObjectId,
        refPath: "senderType" // Dynamic reference based on senderType
    },
    senderType: {
        type: String,
        enum: ["User", "Expert"] // Indicates whether sender is a User or an Expert
    },
    receiver: {
        type: Schema.Types.ObjectId,
        refPath: "receiverType" // Dynamic reference based on receiverType
    },
    receiverType: {
        type: String,
        enum: ["User", "Expert"] // Indicates whether receiver is a User or an Expert
    }
});

const Chat = mongoose.model("Chat" , chatSchema);
module.exports = Chat;