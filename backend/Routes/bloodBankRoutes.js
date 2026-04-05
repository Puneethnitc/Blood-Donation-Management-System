const express = require("express");
const router = express.Router();

const {
  checkDonorRoute,
  addDonationRoute,
  getBloodBankDashboard,
  getInventory,
  getRequests,
  getDonations
} = require("../controllers/bloodBankControllers");

const authMiddleWare = require("../middleware/authMiddleWare");
const roleMiddleware = require("../middleware/roleMiddleWare");

// 🔥 BLOOD BANK DASHBOARD ROUTES

router.get(
  "/",
  authMiddleWare,
  roleMiddleware("BNK"),
  getBloodBankDashboard
);

router.get(
  "/inventory",
  authMiddleWare,
  roleMiddleware("BNK"),
  getInventory
);

router.get(
  "/requests",
  authMiddleWare,
  roleMiddleware("BNK"),
  getRequests
);

router.get(
  "/donations",
  authMiddleWare,
  roleMiddleware("BNK"),
  getDonations
);

// 🔍 CHECK DONOR
router.get(
  "/donor/:donor_id",
  authMiddleWare,
  roleMiddleware("BNK"),
  checkDonorRoute
);

// ➕ ADD DONATION
router.post(
  "/donation",
  authMiddleWare,
  roleMiddleware("BNK"),
  addDonationRoute
);

module.exports = router;