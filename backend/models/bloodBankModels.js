const db = require("../config/db");

// Check donor exists
const checkDonorExists = async (conn, donor_id) => {
  const [rows] = await conn.query(
    "SELECT 1 FROM Donor WHERE donor_id = ?",
    [donor_id]
  );
  return rows.length > 0;
};

// Insert donation
const insertDonation = async (conn, { donor_id, units_donated, bank_id }) => {
  const [result] = await conn.query(
    `INSERT INTO Donation 
     (donor_id, units_donated, donation_date, bank_id)
     VALUES (?, ?, CURDATE(), ?)`,
    [donor_id, units_donated, bank_id]
  );

  return result.insertId;
};

// MAX + 1 + LOCK (NO collection_dt here anymore)
const insertBloodStockWithLock = async (
  conn,
  { bank_id, blood_grp, units_available, donation_id }
) => {

  const [rows] = await conn.query(
    `SELECT COALESCE(MAX(stock_id), 0) AS max_id
     FROM Blood_Stock
     WHERE bank_id = ?
     FOR UPDATE`,
    [bank_id]
  );

  const nextStockId = rows[0].max_id + 1;

  await conn.query(
    `INSERT INTO Blood_Stock
     (stock_id, bank_id, blood_grp, units_available, donation_id)
     VALUES (?, ?, ?, ?, ?)`,
    [nextStockId, bank_id, blood_grp, units_available, donation_id]
  );
};

// DASHBOARD (JOIN with Donation)
const getDashboardData = async (bank_id) => {

  // 1. Total donations
  const [donations] = await db.promise().query(
    `SELECT COUNT(*) AS total_donations
     FROM Donation
     WHERE bank_id = ?`,
    [bank_id]
  );

  // 2. Total units collected
  const [units] = await db.promise().query(
    `SELECT COALESCE(SUM(units_donated), 0) AS total_units
     FROM Donation
     WHERE bank_id = ?`,
    [bank_id]
  );

  // 3. Available stock (non-expired using donation_date)
  const [stock] = await db.promise().query(
    `SELECT COALESCE(SUM(bs.units_available), 0) AS available_units
     FROM Blood_Stock bs
     JOIN Donation d ON bs.donation_id = d.donation_id
     WHERE bs.bank_id = ?
     AND DATE_ADD(d.donation_date, INTERVAL 35 DAY) > CURDATE()`,
    [bank_id]
  );

  // 4. Blood group summary
  const [groupData] = await db.promise().query(
    `SELECT bs.blood_grp, SUM(bs.units_available) AS total_units
     FROM Blood_Stock bs
     JOIN Donation d ON bs.donation_id = d.donation_id
     WHERE bs.bank_id = ?
     AND DATE_ADD(d.donation_date, INTERVAL 35 DAY) > CURDATE()
     GROUP BY bs.blood_grp`,
    [bank_id]
  );

  return {
    total_donations: donations[0].total_donations,
    total_units: units[0].total_units,
    available_units: stock[0].available_units,
    blood_group_summary: groupData
  };
};


//  INVENTORY JOIN with Donation
const getInventoryData = async (bank_id) => {
  const [rows] = await db.promise().query(
    `SELECT 
        bs.stock_id,
        bs.blood_grp,
        bs.units_available,
        d.donation_date AS collection_dt,
        DATE_ADD(d.donation_date, INTERVAL 35 DAY) AS expiry_dt
     FROM Blood_Stock bs
     JOIN Donation d ON bs.donation_id = d.donation_id
     WHERE bs.bank_id = ?
     ORDER BY d.donation_date ASC`,
    [bank_id]
  );

  return rows;
};

module.exports = {
  checkDonorExists,
  insertDonation,
  insertBloodStockWithLock,
  getDashboardData,
  getInventoryData
};