const Review = require("../modules/review.js");
const Product = require("../modules/product.js");

//Controller for reviews
module.exports.reviews = async(req,res) => {
    let product = await Product.findById(req.params.id);
    let userType;
    if (req.user && req.user.role === 'Expert') {
        userType = 'Expert';
    } else {
        userType = 'User';
    }

    let newReview =  new Review(req.body.review);
    newReview.createdBy = req.user.id;
    newReview.userType = userType;
    console.log("New Review:", newReview)
    product.review.push(newReview);
    await newReview.save();
    await product.save();
    req.flash("success" , "Review added succesfully!");
    res.redirect(`/products/${product.id}`);
};

//Controller for deleting reviews
module.exports.deleteReview = async(req, res) => {
    const { id, reviewId } = req.params;
    await Product.findByIdAndUpdate(id, { $pull: { review: reviewId } }); // Update product to remove review
    await Review.findByIdAndDelete(reviewId);
    req.flash("success" , "Review deleted succesfully!")
    res.redirect(`/products/${id}`);
};