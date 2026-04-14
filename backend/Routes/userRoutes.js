const express = require("express");
const router = express.Router();
const authMiddleWare = require("../middleware/authMiddleWare");
const { getUserProfileRoute, changePasswordRoute } = require("../controllers/userControllers");

router.get("/profile", authMiddleWare, getUserProfileRoute);
router.put("/change-password", authMiddleWare, changePasswordRoute);

module.exports = router;

