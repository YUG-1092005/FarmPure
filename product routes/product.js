const express = require("express");
const router = express.Router();
const {isLoggedIn, isOwner, validateProduct}= require("../middleware.js");
const wrapAsync = require("../errors/wrapAsync.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

const productController = require("../product Controllers/product.js");

router
    .route("/")
    .get(wrapAsync(productController.products)) //Created listing of all products
    .post(upload.single('product[image]'),isLoggedIn, validateProduct,wrapAsync(productController.savingNewProduct)) //Saving new product  

//Form for adding new product
router.get("/new" , isLoggedIn, productController.newProductForm);

router
    .route("/:id")
    .get(wrapAsync(productController.showProduct)) //To show data of a particular product
    .put(upload.single('product[image]') , isLoggedIn , isOwner, validateProduct, wrapAsync(productController.editingProduct)) //Editing particular product
    .delete(isLoggedIn,isOwner, wrapAsync(productController.deleteProduct)); //Deleting particular product

//Displaying edit form 
router.get("/:id/edit" ,isLoggedIn,isOwner, wrapAsync(productController.editForm));

module.exports = router;