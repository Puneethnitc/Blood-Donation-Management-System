const db = require("../config/db");

const ownsBankMiddleware = async (req, res, next) => {
  try {
    const userId = req.user?.user_id;
    if (!userId || !userId.startsWith("HSP")) {
      return res.status(403).json({ success: false, message: "Hospital access only" });
    }
    const [rows] = await db.promise().query(
      "SELECT bank_id FROM Owns WHERE hospital_id = ? LIMIT 1",
      [userId]
    );
    if (!rows.length) {
      return res.status(403).json({ success: false, message: "No owned blood bank found" });
    }
    req.bank_id = rows[0].bank_id;
    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = ownsBankMiddleware;
