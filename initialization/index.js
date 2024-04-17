
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Product = require("../modules/product.js");
const initData = require("./data.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/farmpure";

async function main() {
    await mongoose.connect(MONGO_URL);
};

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((e) => {
        console.log("Error is: ", e);
    });

app.listen(8080 ,() => {
    console.log("Server listening to the port 8080");
});

//Initialization of sample data in DB
const initDb = async() => {
    await Product.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj ,  owner:"65cf4ff310aba591c8cb839d"}));
    await Product.insertMany(initData.data);
    console.log("data initialized");
}
initDb();