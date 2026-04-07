const express = require("express");
const router = express.Router();

const { getLowStockAlerts } = require("./controller");

// Low stock alerts route
router.get("/companies/:companyId/alerts/low-stock", getLowStockAlerts);

module.exports = router;
