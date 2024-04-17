const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const passportLocalMongoose = require("passport-local-mongoose");


const expertSchema = new Schema({
    name: {
        type: String,
    },
    profession: {
        type: String,
    },
    img: {
        url: String,
        filename: String,
    },
    about: {
        type: String,
    },
    organization: {
        type: String,
    },
    experience: {
        type: Number,
    },
    email: {
        type: String,
    },
    review: [
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    role: {
        type: String,
        enum: ['Expert', 'User'], // Example roles
        default: 'Expert'
    }
});

//Deleting review if product is deleted
expertSchema.post("findOneAndDelete" , async(expert) => {
    if(expert) {
        await Review.deleteMany({ _id: { $in:expert.review } })
    }
});

expertSchema.plugin(passportLocalMongoose);

const Expert = mongoose.model("Expert" , expertSchema);
module.exports = Expert;