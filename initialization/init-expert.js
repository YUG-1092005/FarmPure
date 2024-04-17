const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Expert = require("../modules/expert.js");
const expertData = require("./expert-data.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/farmpure";

async function main() {
    await mongoose.connect(MONGO_URL);
};

main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((e) => {
        console.log("Error" , e);
    });

    app.listen(8080 ,() => {
        console.log("Server listening to the port 8080");
    });

const initData = async() => {
    await Expert.deleteMany({});
    await Expert.insertMany(expertData.data);    
}
initData();