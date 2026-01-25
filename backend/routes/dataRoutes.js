const express = require("express");
const Data = require("../models/Data");
const router = express.Router();

router.get("/data", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filters = {};
    if (req.query.topic) filters.topic = req.query.topic;
    if (req.query.sector) filters.sector = req.query.sector;
    if (req.query.region) filters.region = req.query.region;
    if (req.query.country) filters.country = req.query.country;
    if (req.query.end_year) filters.end_year = req.query.end_year;
    if (req.query.pestle) filters.pestle = req.query.pestle;
    if (req.query.source) filters.source = req.query.source;
    const total = await Data.countDocuments(filters);

    const data = await Data.find(filters)
      .skip(skip)
      .limit(limit);

    res.json({
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalRecords: total,
      data
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
