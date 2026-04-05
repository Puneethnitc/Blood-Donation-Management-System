const db = require("../config/db");

// 🔍 CHECK DONOR EXISTS
const checkDonorExists = async (conn, donor_id) => {
  const [rows] = await conn.query(
    "SELECT donor_id FROM Donor WHERE donor_id = ?",
    [donor_id]
  );

  return rows.length > 0;
};

// 🔍 CHECK ELIGIBILITY
const checkDonorEligibility = async (conn, donor_id) => {
  const [rows] = await conn.query(
    `
    SELECT donation_date 
    FROM Donation
    WHERE donor_id = ?
    ORDER BY donation_date DESC
    LIMIT 1
    `,
    [donor_id]
  );

  if (rows.length === 0) {
    return { eligible: true };
  }

  const lastDate = new Date(rows[0].donation_date);
  const today = new Date();

  const diffDays = (today - lastDate) / (1000 * 60 * 60 * 24);

  if (diffDays < 90) {
    return {
      eligible: false,
      days_left: Math.ceil(90 - diffDays)
    };
  }

  return { eligible: true };
};

// ➕ INSERT DONATION
const insertDonation = async (conn, { donor_id, units_donated, bank_id }) => {
  const [result] = await conn.query(
    `INSERT INTO Donation 
     (donor_id, units_donated, donation_date, bank_id)
     VALUES (?, ?, CURDATE(), ?)`,
    [donor_id, units_donated, bank_id]
  );

  return result.insertId;
};

// 🔒 STOCK INSERT (SAFE)
const insertBloodStockWithLock = async (
  conn,
  { bank_id, blood_grp, units_available, donation_id }
) => {
  const [rows] = await conn.query(
    `
    SELECT COALESCE(MAX(stock_id), 0) AS max_id
    FROM Blood_Stock
    WHERE bank_id = ?
    FOR UPDATE
    `,
    [bank_id]
  );

  const nextStockId = rows[0].max_id + 1;

  await conn.query(
    `
    INSERT INTO Blood_Stock
    (stock_id, bank_id, blood_grp, units_available, donation_id)
    VALUES (?, ?, ?, ?, ?)
    `,
    [nextStockId, bank_id, blood_grp, units_available, donation_id]
  );
};
const getDashboardData = async (bank_id) => {
  const conn = await db.promise();

  // total units
  const [total] = await conn.query(
    `SELECT SUM(units_available) AS total_units
     FROM Blood_Stock
     WHERE bank_id = ?`,
    [bank_id]
  );

  // pending requests
  const [pending] = await conn.query(
    `SELECT COUNT(*) AS pending_requests
     FROM Requests_sent_to_BloodBanks
     WHERE bank_id = ? AND request_status = 'Processing'`,
    [bank_id]
  );

  // donations this month
  const [donations] = await conn.query(
    `SELECT COUNT(*) AS donations_this_month
     FROM Donation
     WHERE bank_id = ?
     AND MONTH(donation_date) = MONTH(CURRENT_DATE())`,
    [bank_id]
  );

  // low stock
  const [low] = await conn.query(
    `SELECT blood_grp, SUM(units_available) AS units
     FROM Blood_Stock
     WHERE bank_id = ?
     GROUP BY blood_grp
     HAVING units <= 5`,
    [bank_id]
  );

  return {
    total_units: total[0].total_units || 0,
    pending_requests: pending[0].pending_requests,
    donations_this_month: donations[0].donations_this_month,
    low_stock: low
  };
};
const getInventoryData = async (bank_id) => {
  const conn = await db.promise();

  const [rows] = await conn.query(
    `SELECT blood_grp, SUM(units_available) AS units
     FROM Blood_Stock
     WHERE bank_id = ?
     GROUP BY blood_grp`,
    [bank_id]
  );

  return rows;
};
const getRequestData = async (bank_id) => {
  const conn = await db.promise();

  const [rows] = await conn.query(
    `
    SELECT 
      r.request_id,
      r.blood_grp,
      r.units_required AS units,
      rs.request_status AS status,
      u.name AS hospital_name
    FROM Requests_sent_to_BloodBanks rs
    JOIN Blood_Request_from_hospital r 
      ON rs.request_id = r.request_id
    JOIN User u 
      ON r.hospital_id = u.user_id
    WHERE rs.bank_id = ?
    ORDER BY r.requested_date DESC
    `,
    [bank_id]
  );

  return rows;
};
const getDonationHistory = async (bank_id) => {
  const conn = await db.promise();

  const [rows] = await conn.query(
    `
    SELECT 
      d.donation_id,
      u.name AS donor_name,
      d.units_donated AS units,
      d.donation_date AS date
    FROM Donation d
    JOIN User u ON d.donor_id = u.user_id
    WHERE d.bank_id = ?
    ORDER BY d.donation_date DESC
    `,
    [bank_id]
  );

  return rows;
};
module.exports = {
  checkDonorExists,
  checkDonorEligibility,
  insertDonation,
  insertBloodStockWithLock,
  getDashboardData,
  getInventoryData,
  getRequestData,
  getDonationHistory
};