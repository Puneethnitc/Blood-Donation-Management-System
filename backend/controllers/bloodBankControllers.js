const db = require("../config/db");

const {
  checkDonorExists,
  insertDonation,
  insertBloodStockWithLock,
  getDashboardData,
  getInventoryData
} = require("../models/bloodBankModels");

// ADD DONATION
const addDonationRoute = async (req, res) => {
  const connection = await db.promise().getConnection();

  try {
    const { donor_id, units, blood_grp } = req.body;
    const bank_id = req.user.user_id;

    if (!donor_id || !units || !blood_grp) {
      return res.status(400).json({
        message: "Missing required fields",
        success: false
      });
    }

    await connection.beginTransaction();

    const exists = await checkDonorExists(connection, donor_id);
    if (!exists) {
      await connection.rollback();
      return res.status(404).json({
        message: "Donor not registered",
        success: false
      });
    }

    const donation_id = await insertDonation(connection, {
      donor_id,
      units_donated: units,
      bank_id
    });

    await insertBloodStockWithLock(connection, {
      bank_id,
      blood_grp,
      units_available: units,
      donation_id
    });

    await connection.commit();

    return res.status(201).json({
      message: "Donation stored successfully",
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

// DASHBOARD
const getDashboard = async (req, res) => {
  try {
    const bank_id = req.user.user_id;

    const data = await getDashboardData(bank_id);

    return res.status(200).json({
      message: "Dashboard data fetched",
      success: true,
      data
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Server error",
      success: false
    });
  }
};

// INVENTORY
const getInventory = async (req, res) => {
  try {
    const bank_id = req.user.user_id;

    const inventory = await getInventoryData(bank_id);

    return res.status(200).json({
      message: "Inventory fetched",
      success: true,
      inventory
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Server error",
      success: false
    });
  }
};

module.exports = {
  addDonationRoute,
  getDashboard,
  getInventory
};