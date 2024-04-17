const Review = require("../modules/review.js");
const Expert = require("../modules/expert.js");

//Controller for expert review
module.exports.expertReview = async(req,res) => {
    let expert = await Expert.findById( req.params.id);
    let userType;
    if (req.user && req.user.role === "User") {
        userType = 'User';
    } else {
        userType = 'Expert';
    }
    let newReview =  new Review(req.body.review);
    newReview.createdBy = req.user.id;
    newReview.userType = userType;
    expert.review.push(newReview);
    await newReview.save();
    await expert.save();
    req.flash("success" , "Review added succesfully!");
    res.redirect(`/experts/${expert.id}`);
};

//Controller for deleting expert review
module.exports.deleteExpertReview = async(req,res) => {
    let {id,reviewId} = req.params;
    await Expert.findByIdAndUpdate(id , {$pull : {review : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success" , "Review Deleted Successfully");
    res.redirect(`/experts/${id}`);
};