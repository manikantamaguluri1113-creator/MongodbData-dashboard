const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/data", require("./routes/dataRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/insights", require("./routes/insights"));


app.listen(5000, () => {
  console.log("Server running on port 5000");
});
