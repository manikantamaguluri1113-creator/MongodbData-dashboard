const mongoose = require("mongoose");
const fs = require("fs");
const Insight = require("./models/Insight");

mongoose.connect("mongodb://localhost:27017/blackcoffer");

const data = JSON.parse(fs.readFileSync("jsondata.json"));

Insight.insertMany(data)
  .then(() => {
    console.log("Data imported successfully");
    process.exit();
  });
