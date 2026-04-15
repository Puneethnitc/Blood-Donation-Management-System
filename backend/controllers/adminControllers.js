const db = require("../config/db");

const getAdminDashboard = async (req, res) => {
  try {
    const [[users]] = await db.promise().query(
      `SELECT COUNT(*) AS users_count FROM \`User\``
    );
    const [[donors]] = await db.promise().query(
      `SELECT COUNT(*) AS donors_count FROM Donor`
    );
    const [[hospitals]] = await db.promise().query(
      `SELECT COUNT(*) AS hospitals_count FROM Hospital`
    );
    const [[banks]] = await db.promise().query(
      `SELECT COUNT(*) AS banks_count FROM Blood_Bank`
    );
    const [[donations]] = await db.promise().query(
      `SELECT COUNT(*) AS donations_count FROM Donation`
    );
    const [[requests]] = await db.promise().query(
      `SELECT COUNT(*) AS requests_count FROM Blood_Request_from_hospital`
    );

    return res.json({
      success: true,
      data: {
        users: users.users_count || 0,
        donors: donors.donors_count || 0,
        hospitals: hospitals.hospitals_count || 0,
        banks: banks.banks_count || 0,
        donations: donations.donations_count || 0,
        requests: requests.requests_count || 0,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAdminUsers = async (req, res) => {
  try {
    const [users] = await db.promise().query(
      `SELECT user_id, name, email, phone_no, user_type, created_dt
       FROM \`User\` ORDER BY created_dt DESC`
    );
    return res.json({ success: true, data: users });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAdminDonations = async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT
        d.donation_id,
        d.donor_id,
        du.name AS donor_name,
        d.units_donated AS units,
        d.donation_date AS date,
        d.bank_id,
        bu.name AS bank_name
       FROM Donation d
       JOIN \`User\` du ON d.donor_id = du.user_id
       JOIN \`User\` bu ON d.bank_id = bu.user_id
       ORDER BY d.donation_date DESC`
    );
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAdminRequests = async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT
        r.request_id,
        r.hospital_id,
        hu.name AS hospital_name,
        r.blood_grp,
        r.units_required,
        r.final_status,
        r.requested_date,
        rs.bank_id,
        bu.name AS bank_name,
        rs.request_status
       FROM Blood_Request_from_hospital r
       JOIN \`User\` hu ON r.hospital_id = hu.user_id
       LEFT JOIN Requests_sent_to_BloodBanks rs ON rs.request_id = r.request_id
       LEFT JOIN \`User\` bu ON rs.bank_id = bu.user_id
       ORDER BY r.requested_date DESC`
    );
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAdminStock = async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT
        bs.bank_id,
        bu.name AS bank_name,
        bs.blood_grp,
        SUM(bs.units_available) AS units
       FROM Blood_Stock bs
       JOIN \`User\` bu ON bs.bank_id = bu.user_id
       GROUP BY bs.bank_id, bu.name, bs.blood_grp
       ORDER BY bu.name ASC, bs.blood_grp ASC`
    );
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getAdminIssued = async (req, res) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT
        i.issued_id,
        i.request_id,
        i.bank_id,
        COALESCE(bu.name, '') AS bank_name,
        r.hospital_id,
        COALESCE(hu.name, '') AS hospital_name,
        i.blood_grp,
        i.units_issued AS units,
        i.issued_date AS issued_date
       FROM Blood_issued_to_hospital i
       LEFT JOIN Blood_Request_from_hospital r ON i.request_id = r.request_id
       LEFT JOIN \`User\` bu ON i.bank_id = bu.user_id
       LEFT JOIN \`User\` hu ON r.hospital_id = hu.user_id
       ORDER BY i.issued_date DESC`
    );
    return res.json({ success: true, data: rows });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getAdminDashboard,
  getAdminUsers,
  getAdminDonations,
  getAdminRequests,
  getAdminStock,
  getAdminIssued,
};

