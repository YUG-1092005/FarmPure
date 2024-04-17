const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../errors/wrapAsync.js");
const {isLoggedIn,isExpertLoggedIn} = require("../middleware.js");

//Checking user type
const checkUserType = (req,res,next) => {
    if(req.isAuthenticated()) {
        if(req.user.isExpert) {
            return isExpertLoggedIn(req,res,next);
        }
        else {
            return isLoggedIn(req,res,next);
        }
    }else {
            res.redirect("/login");
    }
};

const chatController = require("../chat Controller/chat.js");

router
    .route("/")
    .get(checkUserType, wrapAsync(chatController.chatPage)) //Chat Page
    .post(checkUserType ,wrapAsync(chatController.saveChat)); //Saving expert chat

module.exports = router;
