require("dotenv").config();

const express = require("express");
const app = express();

const routes = require("./routes");

app.use(express.json());

// API routes
app.use("/api", routes);

// Health check
app.get("/", (req, res) => {
  res.send("StockFlow API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
