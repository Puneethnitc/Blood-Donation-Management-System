const express = require("express");
const router = express.Router();

const bloodRequestController = require("../controllers/bloodRequestController");

router.post("/send-request", bloodRequestController.sendRequestToBanks);

module.exports = router;