const express = require("express");
const router = express.Router();

const {
  checkDonorRoute,
  addDonationRoute,
  getBloodBankDashboard,
  getInventory,
  getRequests,
  getDonations,
  fulfillRequestRoute,
  rejectRequestRoute,
  adjustStockRoute,
  writeOffStockRoute
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
router.post(
  "/request/:request_id/fulfill",
  authMiddleWare,
  roleMiddleware("BNK"),
  fulfillRequestRoute
);
router.post(
  "/request/:request_id/reject",
  authMiddleWare,
  roleMiddleware("BNK"),
  rejectRequestRoute
);
router.put(
  "/inventory/adjust",
  authMiddleWare,
  roleMiddleware("BNK"),
  adjustStockRoute
);
router.delete(
  "/inventory/:stock_id",
  authMiddleWare,
  roleMiddleware("BNK"),
  writeOffStockRoute
);

module.exports = router;