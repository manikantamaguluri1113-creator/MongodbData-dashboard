const express = require("express");
const router = express.Router();
const authenticateJWT = require("../middleware/auth");
const Insight = require("../models/Insight"); // or Data model

router.get("/", authenticateJWT, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 9,
      topic,
      sector,
      region,
      country
    } = req.query;

    const filter = {};

    if (topic) filter.topic = topic;
    if (sector) filter.sector = sector;
    if (region) filter.region = region;
    if (country) filter.country = country;
    if (req.query.pestle) filter.pestle = req.query.pestle;
    if (req.query.source) filter.source = req.query.source;
    if (req.query.end_year) filter.end_year = Number(req.query.end_year);

    const skip = (page - 1) * limit;
    const totalCount = await Insight.countDocuments(filter);
    const data = await Insight.find(filter)
      .skip(Number(skip))
      .limit(Number(limit));

    res.json({data, totalCount});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/filters", authenticateJWT, async (req, res) => {
  try {
    const data = await Insight.find({}, {
      topic: 1,
      sector: 1,
      region: 1,
      country: 1,
      pestle: 1,
      source: 1,
      end_year: 1
    });

    const unique = (key) =>
      [...new Set(data.map(d => d[key]).filter(Boolean))];

    res.json({
      topics: unique("topic"),
      sectors: unique("sector"),
      regions: unique("region"),
      countries: unique("country"),
      pestles: unique("pestle"),
      sources: unique("source"),
      endYears: unique("end_year")
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load filters" });
  }
});


module.exports = router;
