const express = require("express");
const router = express.Router();
const wrapAsync = require("../errors/wrapAsync.js");
const {isLoggedIn, saveRedirectUrl}= require("../middleware.js");
const passport = require("passport");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

const expertAuthorizationController = require("../authorization Controller/expert.js");

router
    .route("/registration") 
    .get(isLoggedIn, expertAuthorizationController.expertSignupForm) //Expert SignUp
    .post(upload.single('expert[img]'),wrapAsync(expertAuthorizationController.expert)); //Registrating expert

router 
    .route("/authenticate")
    .get(expertAuthorizationController.expertLoginForm) //Expert Login
    .post(saveRedirectUrl,passport.authenticate('expert-local', {failureFlash: true ,  failureRedirect: '/expert/authenticate'}),
     expertAuthorizationController.expertLogin  //Checking expert there or not
    );

 module.exports = router;
 