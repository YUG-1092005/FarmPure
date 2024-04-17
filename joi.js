const Joi = require("joi");

//Validation for products
const productSchema = Joi.object({
    product: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(1),
        image: Joi.string().allow("" , null),
        location: Joi.string().required(),
        country: Joi.string().required(),
        contact: Joi.number().required(),
    }).required()
});


//Validation for reviews
const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        comment: Joi.string().required(),
    }).required()
});


//Validation for experts
const expertSchema = Joi.object({
    expert: Joi.object({
        name: Joi.string().required(),
        profession: Joi.string().required(),
        img: Joi.string().optional(),
        about: Joi.string().required(),
        organization: Joi.string().required(),
        experience: Joi.number().required().min(3),
    }).required()
});

module.exports = {
    productSchema,
    reviewSchema,
    expertSchema
};

