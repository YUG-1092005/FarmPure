const express = require("express");
const router = express.Router();
const wrapAsync = require("../errors/wrapAsync.js");
const {saveRedirectUrl}= require("../middleware.js");
const passport = require("passport");

const userController = require("../authorization Controller/user.js");

//SignUp form for user
router.get("/signup" ,userController.signupForm);

//Saving user in DB
router.post("/signup" , wrapAsync(userController.user));

//Login form page for user
router.get("/login" ,userController.loginForm);

//Checking user there or not
router.post("/login", saveRedirectUrl,
passport.authenticate('user-local', { failureRedirect: '/login', failureFlash:true}),
userController.userLogin
);

//Logout routefor users
router.get("/logout" , userController.logout);

module.exports = router;