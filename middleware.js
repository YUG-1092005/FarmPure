const Product = require("./modules/product.js");
const Review = require("./modules/review.js");
const ExpressError = require("./errors/ExpressError.js");
const {productSchema,expertSchema, reviewSchema} = require("./joi.js");

//Middleware for user login 
const isLoggedIn = (req, res, next) => {

    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("failure", "You must be logged in"); 
        return res.redirect("/login");
    }
    next();
};

//Middleware for expert login
const isExpertLoggedIn = (req, res, next) => {
    console.log("REQ.USER: ", req.user);

    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("failure", "You must be logged in"); 
        return res.redirect("/expert/authenticate");
    }
    next();
};

//Redirect url
const saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

//Checking owner of particular product
const isOwner = async(req,res,next) => {
    let {id} = req.params;
    let product = await Product.findById(id);
    if(!product.owner.equals(res.locals.currUser._id)) {
        req.flash("failure" , "You are not the owner of the product");
        return res.redirect(`/products/${id}`);
    }
    next();
};

//Checking review owner
const isReviewAuthor = async(req,res,next) => {
    let {id , reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.createdBy.equals(res.locals.currUser._id)) {
        req.flash("failure" , "You dont have any access to this review");
        return res.redirect(`/products/${id}`);
    }
    next();
};

//Checking experts review owner
const isExpertReviewAuthor = async(req,res,next) => {
    let {id , reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.createdBy.equals(res.locals.currUser._id)) {
        req.flash("failure" , "You dont have any access to this review");
        return res.redirect(`/experts/${id}`);
    }
    next();
}

//Handling error from server side, checks both empty product object as well as individual fields
const validateProduct = (req, res, next) => {
    let {error} = productSchema.validate(req.body);
    if(error) {
        console.log(error);
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400 ,errMsg)
    }else {
        next()
    }
}


//Handling error from server side, checks both empty expert details, object as well as individual fields
const validateExpert = (req, res, next) => {
    let { error } = expertSchema.validate(req.body);
    if (error) {
        console.log(error);
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


//Handling error from server side, checks both empty review object as well as individual fields
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        console.log(error);
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports = {isLoggedIn, saveRedirectUrl,isOwner,isReviewAuthor,isExpertLoggedIn ,isExpertReviewAuthor,validateProduct,validateReview,validateExpert};