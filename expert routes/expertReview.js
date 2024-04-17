const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../errors/wrapAsync.js");
const Expert = require("../modules/expert.js");
const Review = require("../modules/review.js");
const {isLoggedIn, isExpertLoggedIn, isExpertReviewAuthor, validateReview}= require("../middleware.js");

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

const reviewController = require("../expert Controllers/expertReview.js");

//Reviews saving
router.post("/" ,checkUserType ,validateReview, wrapAsync(reviewController.expertReview));

//Deleting review of expert
router.delete("/:reviewId" ,isExpertReviewAuthor, wrapAsync(reviewController.deleteExpertReview));

module.exports = router;
