const {
  checkDonorExists,
  checkDonorEligibility,
  insertDonation,
  insertBloodStockWithLock,
  getDashboardData,
  getInventoryData,
  getRequestData,
  getDonationHistory
} = require("../models/bloodBankModels");

const checkDonorRoute = async (req, res) => {
  try {
    const { donor_id } = req.params;

    const conn = await db.getConnection();

    const exists = await checkDonorExists(conn, donor_id);

    if (!exists) {
      conn.release();
      return res.status(404).json({
        message: "Donor not found",
        success: false
      });
    }

    const eligibility = await checkDonorEligibility(conn, donor_id);

    conn.release();

    return res.json({
      success: true,
      eligible: eligibility.eligible,
      days_left: eligibility.days_left || 0
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Server error",
      success: false
    });
  }
};

const addDonationRoute = async (req, res) => {
  const connection = await db.getConnection();

  try {
    const { donor_id, units, blood_grp } = req.body;
    const bank_id = req.user.user_id;

    await connection.beginTransaction();

    // 1️⃣ Check donor exists
    const exists = await checkDonorExists(connection, donor_id);
    if (!exists) {
      await connection.rollback();
      return res.status(404).json({
        message: "Donor not registered",
        success: false
      });
    }

    // 2️⃣ Check eligibility
    const eligibility = await checkDonorEligibility(connection, donor_id);

    if (!eligibility.eligible) {
      await connection.rollback();
      return res.status(400).json({
        message: `Donor not eligible. Try after ${eligibility.days_left} days`,
        success: false
      });
    }

    // 3️⃣ Insert donation
    const donation_id = await insertDonation(connection, {
      donor_id,
      units_donated: units,
      bank_id
    });

    // 4️⃣ Insert stock
    await insertBloodStockWithLock(connection, {
      bank_id,
      blood_grp,
      units_available: units,
      donation_id
    });

    await connection.commit();

    return res.status(201).json({
      message: "Donation successful",
      success: true
    });

  } catch (err) {
    await connection.rollback();
    console.log(err);

    return res.status(500).json({
      message: "Server error",
      success: false
    });

  } finally {
    connection.release();
  }
};
const getBloodBankDashboard = async (req, res) => {
  try {
    const bank_id = req.user.user_id;

    const data = await getDashboardData(bank_id);

    res.json({
      success: true,
      ...data
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
const getInventory = async (req, res) => {
  try {
    const bank_id = req.user.user_id;

    const data = await getInventoryData(bank_id);

    res.json(data);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
const getRequests = async (req, res) => {
  try {
    const bank_id = req.user.user_id;

    const data = await getRequestData(bank_id);

    res.json(data);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
const getDonations = async (req, res) => {
  try {
    const bank_id = req.user.user_id;

    const data = await getDonationHistory(bank_id);

    res.json(data);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  checkDonorRoute,
  addDonationRoute,
  getBloodBankDashboard,
  getInventory,
  getRequests,
  getDonations
};