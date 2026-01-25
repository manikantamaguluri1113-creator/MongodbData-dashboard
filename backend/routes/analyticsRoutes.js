const express = require("express");
const Data = require("../models/Data");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/avg-intensity-country", auth, async (req, res) => {
  const result = await Data.aggregate([
    { $match: { intensity: { $ne: null } } },
    {
      $group: {
        _id: "$country",
        avgIntensity: { $avg: "$intensity" }
      }
    },
    { $sort: { avgIntensity: -1 } }
  ]);

  res.json(result);
});

router.get("/intensity-by-year", auth, async (req, res) => {
  const result = await Data.aggregate([
    { $match: { start_year: { $ne: "" } } },
    {
      $group: {
        _id: "$start_year",
        avgIntensity: { $avg: "$intensity" }
      }
    },
    { $sort: { _id: 1 } }
  ]);
  res.json(result);
});

module.exports = router;
