const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['User', 'Expert'], // Example roles
        default: 'User'
    }
});

userSchema.plugin(passportLocalMongoose);//adds username and password with hash and salt by default passport

const User = mongoose.model("User" , userSchema);
module.exports = User;