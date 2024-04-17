const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../errors/wrapAsync.js");
const Product = require("../modules/product.js");
const Review = require("../modules/review.js");
const {isLoggedIn,isExpertLoggedIn,isReviewAuthor,validateReview}= require("../middleware.js");

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

const reviewController = require("../product Controllers/productReview.js");

//Reviews saving 
router.post("/" ,checkUserType,validateReview, wrapAsync(reviewController.reviews));

//Review Deleting
router.delete("/:reviewId" ,isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;