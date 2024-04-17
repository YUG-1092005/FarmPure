const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    comment: {
        type:String,
    },
    rating: {
        type:Number,
        min: 1,
        max:5,
    },
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        refPath: 'userType',
    },
    userType: {
        type:  String,
        enum: ['User', 'Expert']
    }
});

const Review = mongoose.model("Review" , reviewSchema);
module.exports = Review;