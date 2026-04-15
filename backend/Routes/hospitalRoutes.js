const express = require("express");
const router = express.Router();

const authMiddleWare = require("../middleware/authMiddleWare");
const roleMiddleware = require("../middleware/roleMiddleWare");

const {
  searchBanksRoute,
  sendRequestRoute,
  getHospitalRequestsRoute,
  cancelRequestRoute,
  cancelBankRequestRoute,
  incomingRequestsRoute,
  getHospitalDashboardRoute
} = require("../controllers/hospitalControllers");


router.get(
  "/dashboard",
  authMiddleWare,
  roleMiddleware("HSP"),
  getHospitalDashboardRoute
);


// Search Blood Banks
router.get("/find-banks", authMiddleWare,roleMiddleware("HSP"), searchBanksRoute);
// Send Blood Request
router.post(
    "/send-request",
    authMiddleWare,
    roleMiddleware("HSP"),
    sendRequestRoute
);


// View My Requests
router.get(
    "/requests",
    authMiddleWare,
    roleMiddleware("HSP"),
    getHospitalRequestsRoute
);

// Cancel Request
router.put(
    "/cancel/:request_id",
    authMiddleWare,
    roleMiddleware("HSP"),
    cancelRequestRoute
);

// Cancel Request for a specific bank
router.put(
    "/cancel/:request_id/:bank_id",
    authMiddleWare,
    roleMiddleware("HSP"),
    cancelBankRequestRoute
);


// Blood Bank Incoming Requests
router.get(
    "/incoming/:bank_id",
    authMiddleWare,
    roleMiddleware("BNK"),
    incomingRequestsRoute
);


module.exports = router;