const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/bloodRequestController");

// Hospital
router.post("/search-banks", ctrl.searchBanks);
router.post("/send-request", ctrl.sendRequest);
router.get("/my-requests/:hospital_id", ctrl.getHospitalRequests);
router.put("/cancel/:request_id", ctrl.cancelRequest);

// Blood bank
router.get("/incoming/:bank_id", ctrl.getIncomingRequests);
router.put("/fulfill/:request_id/:bank_id", ctrl.fulfillRequest);
router.put("/reject/:request_id/:bank_id", ctrl.rejectRequest);

module.exports = router;