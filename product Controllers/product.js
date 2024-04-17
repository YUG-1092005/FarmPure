const Product = require("../modules/product.js");

//Controller for showing all products
module.exports.products = async (req,res) => {
    let allProducts = await Product.find({}); //all products will be available
    res.render("./products/index.ejs" , {allProducts});
};

//Controller for new product
module.exports.newProductForm =  (req,res) => {
    if(req.user.role == "Expert") {
        req.flash("failure","Sorry,You don't have access to create product")
        res.redirect("/products");
    }
    res.render("./products/new.ejs");
};

//Controller for saving new product
module.exports.savingNewProduct = async(req,res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    
    let newProduct = await Product(req.body.product);
    console.log(req.body.product);
    newProduct.owner = req.user._id;
    newProduct.image = {url , filename}
    await newProduct.save();
    req.flash("success" , "Product added succesfully!")
    res.redirect("/products");
}

//Controller for showing particular product
module.exports.showProduct = async (req,res) => {
    let {id} = req.params;

    let product = await Product.findById(id)
    .populate({path: "review" , populate : {path:"createdBy"}})
    .populate("owner");
    if(!product) {
        req.flash("failure" , "Product you are trying to access does not exist")
        res.redirect("/products");
    }
    res.render("./products/show.ejs" , {product});
};

//Controller for edit form
module.exports.editForm = async (req,res) => {
    let {id} = req.params;
    let product = await Product.findById(id);
    if(!product) {
        req.flash("failure" , "Product you are trying to access does not exist")
        res.redirect("/products");
    }

    let originalProductUrl = product.image.url;
    res.render("./products/edit.ejs" , {product , originalProductUrl});
};

//Controller for editing product
module.exports.editingProduct = async (req,res) => {
    let {id} = req.params;
    let product = await Product.findByIdAndUpdate(id , {...req.body.product});

    if(typeof req.file != "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    product.image = {url , filename};
    await product.save();
    }

    req.flash("success" , "Product edited succesfully!");
    res.redirect(`/products/${id}`);
};

//Controller for deleting product
module.exports.deleteProduct = async( req,res) => {
    let {id} = req.params;
    await Product.findByIdAndDelete(id);
    req.flash("success" , "Product deleted succesfully!");
    res.redirect("/products");
};

