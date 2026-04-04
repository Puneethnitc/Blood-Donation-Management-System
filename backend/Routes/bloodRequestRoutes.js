const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/bloodRequestController");

// Hospital APIs
router.post("/search-banks", ctrl.searchBanks);
router.post("/send-request", ctrl.sendRequest);
router.get("/my-requests/:hospital_id", ctrl.getHospitalRequests);
router.put("/cancel/:request_id", ctrl.cancelRequest);

// Blood bank APIs
router.get("/incoming/:bank_id", ctrl.getIncomingRequests);

module.exports = router;