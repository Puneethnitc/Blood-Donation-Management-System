const express = require("express");
const router = express.Router();

const authMiddleWare = require("../middleware/authMiddleWare");
const roleMiddleware = require("../middleware/roleMiddleWare");

const {
  addDonationRoute,
  getDashboard,
  getInventory
} = require("../controllers/bloodBankControllers");

router.post(
  "/add-donation",
  authMiddleWare,
  roleMiddleware("BNK"),
  addDonationRoute
);

router.get(
  "/dashboard",
  authMiddleWare,
  roleMiddleware("BNK"),
  getDashboard
);

router.get(
  "/inventory",
  authMiddleWare,
  roleMiddleware("BNK"),
  getInventory
);

module.exports = router;