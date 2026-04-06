const {
  checkDonorExists,
  insertDonor,
  checkBloodBankExists,
  insertBloodBank,
  checkHospitalExists,
  insertHospital
} = require("../models/profileSetupModels");
const db = require("../config/db");
const bcrypt = require("bcrypt");

const generateUniqueBankId = async (conn) => {
  while (true) {
    const candidate = `BNK${Date.now().toString().slice(-6)}${Math.floor(Math.random() * 10)}`;
    const [rows] = await conn.query(
      "SELECT 1 FROM `User` WHERE user_id = ? LIMIT 1",
      [candidate]
    );
    if (!rows.length) return candidate;
  }
};

// Donor
const registerDonor = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { blood_grp, dob } = req.body;

    const exists = await checkDonorExists(user_id);
    if (exists) {
      return res.status(400).json({
        message: "Donor already registered",
        success: false
      });
    }

    await insertDonor({ user_id, blood_grp, dob });

    return res.status(201).json({
      message: "Donor registered successfully",
      success: true
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Server error",
      success: false
    });
  }
};


// Blood Bank
const registerBloodBank = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { latitude, longitude } = req.body;

    const exists = await checkBloodBankExists(user_id);
    if (exists) {
      return res.status(400).json({
        message: "Blood bank already registered",
        success: false
      });
    }

    await insertBloodBank({ user_id, latitude, longitude });

    return res.status(201).json({
      message: "Blood bank registered successfully",
      success: true
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Server error",
      success: false
    });
  }
};


// Hospital
const registerHospital = async (req, res) => {
  let conn;
  try {
    const hospital_id = req.user.user_id;
    const {
      latitude,
      longitude,
      owns_bank,
      bank_name,
      bank_email,
      bank_phone,
      bank_password
    } = req.body;

    console.log("[registerHospital] hospital_id:", hospital_id);

    conn = await db.promise().getConnection();
    await conn.beginTransaction();

    const [hospitalExists] = await conn.query(
      "SELECT 1 FROM Hospital WHERE hospital_id = ? LIMIT 1",
      [hospital_id]
    );
    if (hospitalExists.length) {
      await conn.rollback();
      return res.status(400).json({
        message: "Hospital already registered",
        success: false
      });
    }

    // Ensure organization location exists before hospital row for FK compatibility.
    await conn.query(
      `INSERT INTO Organization_Location (organisation_id, latitude, longitude)
       VALUES (?, ?, ?)`,
      [hospital_id, latitude, longitude]
    );
    console.log("[registerHospital] Organization_Location insert success for hospital");

    await conn.query(
      `INSERT INTO Hospital (hospital_id)
       VALUES (?)`,
      [hospital_id]
    );
    console.log("[registerHospital] Hospital insert success");

    let created_bank_id = null;
    if (owns_bank) {
      if (!bank_name || !bank_email || !bank_phone || !bank_password) {
        await conn.rollback();
        return res.status(400).json({
          message: "Missing required blood bank fields",
          success: false
        });
      }

      const bank_id = await generateUniqueBankId(conn);
      created_bank_id = bank_id;
      console.log("[registerHospital] bank_id:", bank_id);

      const password_hash = await bcrypt.hash(String(bank_password), 10);

      // 1) User table (BNK user)
      await conn.query(
        `INSERT INTO \`User\`
         (user_id, name, email, phone_no, user_type, password_hash, created_dt)
         VALUES (?, ?, ?, ?, 'blood_bank', ?, CURDATE())`,
        [bank_id, bank_name, bank_email, bank_phone, password_hash]
      );
      console.log("[registerHospital] User insert success for bank");

      // keep location consistent for FK + map to hospital location
      await conn.query(
        `INSERT INTO Organization_Location (organisation_id, latitude, longitude)
         VALUES (?, ?, ?)`,
        [bank_id, latitude, longitude]
      );
      console.log("[registerHospital] Organization_Location insert success for bank");

      // 2) Blood_Bank table
      await conn.query(
        `INSERT INTO Blood_Bank (bank_id)
         VALUES (?)`,
        [bank_id]
      );
      console.log("[registerHospital] Blood_Bank insert success");

      // 3) Owns table (authenticated hospital id only)
      await conn.query(
        `INSERT INTO Owns (hospital_id, bank_id)
         VALUES (?, ?)`,
        [hospital_id, bank_id]
      );
      console.log("[registerHospital] Owns insert success");
    }

    await conn.commit();
    return res.status(201).json({
      message: owns_bank ? "Hospital and owned blood bank registered successfully" : "Hospital registered successfully",
      success: true,
      bank_id: created_bank_id
    });

  } catch (err) {
    console.log(err);
    if (conn) {
      await conn.rollback();
    }
    return res.status(500).json({
      message: "Failed to register hospital/owned bank. Transaction rolled back.",
      success: false
    });
  } finally {
    if (conn) conn.release();
  }
};

module.exports = {
  registerDonor,
  registerBloodBank,
  registerHospital
};