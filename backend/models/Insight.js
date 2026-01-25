const mongoose = require("mongoose");

const InsightSchema = new mongoose.Schema({}, { strict: false });

module.exports = mongoose.model("Insight", InsightSchema);
