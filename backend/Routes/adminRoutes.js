const express = require("express");
const router = express.Router();
const authMiddleWare = require("../middleware/authMiddleWare");
const roleMiddleware = require("../middleware/roleMiddleWare");
const {
  getAdminDashboard,
  getAdminUsers,
  getAdminDonations,
  getAdminRequests,
  getAdminStock,
  getAdminIssued,
} = require("../controllers/adminControllers");

router.get("/dashboard", authMiddleWare, roleMiddleware("ADM"), getAdminDashboard);
router.get("/users", authMiddleWare, roleMiddleware("ADM"), getAdminUsers);
router.get("/donations", authMiddleWare, roleMiddleware("ADM"), getAdminDonations);
router.get("/requests", authMiddleWare, roleMiddleware("ADM"), getAdminRequests);
router.get("/stock", authMiddleWare, roleMiddleware("ADM"), getAdminStock);
router.get("/issued", authMiddleWare, roleMiddleware("ADM"), getAdminIssued);

module.exports = router;

