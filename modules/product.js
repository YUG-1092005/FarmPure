const mongoose = require("mongoose");
const Review = require("./review.js");
const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type:String,
        required:true,
    },
    description: {
        type:String,
    },
    image: {
        url: String,
        filename: String
        // type:String,
        // default:"https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTcwNjM1MDYyOQ&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080",
        // set : (v) => v ==="" ? "https://images.unsplash.com/photo-1495107334309-fcf20504a5ab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTcwNjM1MDYyOQ&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080" : v,
    },
    price: {
        type:Number,
    },
    location: {
        type:String,
    },
    country: {
        type:String,
    },
    contact: {
        type:Number
    },
    review: [
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner: {
        type:Schema.Types.ObjectId,
        ref:"User",
    }
});

//Deleting review if product is deleted
productSchema.post("findOneAndDelete" , async(product) => {
    if(product) {
        await Review.deleteMany({ _id: { $in: product.review } })
    }
});

const Product = mongoose.model("Product" ,productSchema);
module.exports =Product;