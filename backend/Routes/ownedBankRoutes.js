const express = require("express");
const router = express.Router();
const authMiddleWare = require("../middleware/authMiddleWare");
const ownsBankMiddleware = require("../middleware/ownsBankMiddleware");
const {
  getOwnedDashboard,
  getOwnedInventory,
  getOwnedRequests,
  getOwnedDonations,
  addOwnedDonation,
  fulfillOwnedRequest,
  rejectOwnedRequest,
  adjustOwnedInventory,
  writeOffOwnedInventory,
  useStockRoute
} = require("../controllers/ownedBankControllers");

router.get("/dashboard", authMiddleWare, ownsBankMiddleware, getOwnedDashboard);
router.get("/inventory", authMiddleWare, ownsBankMiddleware, getOwnedInventory);
router.get("/donations", authMiddleWare, ownsBankMiddleware, getOwnedDonations);
router.get("/requests", authMiddleWare, ownsBankMiddleware, getOwnedRequests);
router.post("/donation", authMiddleWare, ownsBankMiddleware, addOwnedDonation);
router.post("/request/:request_id/fulfill", authMiddleWare, ownsBankMiddleware, fulfillOwnedRequest);
router.post("/request/:request_id/reject", authMiddleWare, ownsBankMiddleware, rejectOwnedRequest);
router.put("/inventory/adjust", authMiddleWare, ownsBankMiddleware, adjustOwnedInventory);
router.delete("/inventory/:stock_id", authMiddleWare, ownsBankMiddleware, writeOffOwnedInventory);
router.post("/use-stock", authMiddleWare, ownsBankMiddleware, useStockRoute);

module.exports = router;
