const db = require("../config/db");

// ─────────────────────────────────────────────
// HELPER: Promisify query for transactions
// ─────────────────────────────────────────────
const queryAsync = (connection, sql, params=[]) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

// ─────────────────────────────────────────────
// STEP 1 — FIND NEAREST BANKS WITH SUFFICIENT STOCK
// ─────────────────────────────────────────────
exports.searchBanks = (req, res) => {
    const { hospital_id, blood_grp, units_required } = req.body;
    if (!hospital_id || !blood_grp || !units_required) {
        return res.status(400).json({ message: "hospital_id, blood_grp, units_required required" });
    }

    const getHospitalLocation = `
        SELECT latitude, longitude
        FROM Organization_Location
        WHERE organisation_id = ?
    `;

    db.query(getHospitalLocation, [hospital_id], (err, loc) => {
        if (err) return res.status(500).json({ message: "Location error", error: err.message });
        if (!loc.length) return res.status(404).json({ message: "Hospital location not found" });

        const { latitude, longitude } = loc[0];

        const query = `
            SELECT 
                bs.bank_id,
                u.name AS bank_name,
                SUM(bs.units_available) AS units_available,
                (6371 * ACOS(
                    COS(RADIANS(?)) *
                    COS(RADIANS(ol.latitude)) *
                    COS(RADIANS(ol.longitude) - RADIANS(?)) +
                    SIN(RADIANS(?)) *
                    SIN(RADIANS(ol.latitude))
                )) AS distance
            FROM Blood_Stock bs
            JOIN User u ON bs.bank_id = u.user_id
            JOIN Organization_Location ol ON bs.bank_id = ol.organisation_id
            WHERE bs.blood_grp = ? AND u.user_type='bank'
            GROUP BY bs.bank_id
            HAVING SUM(bs.units_available) >= ?
            ORDER BY distance ASC
        `;

        db.query(query, [latitude, longitude, latitude, blood_grp, units_required], (err, result) => {
            if (err) return res.status(500).json({ message: "Search error", error: err.message });
            res.json(result);
        });
    });
};

// ─────────────────────────────────────────────
// STEP 2 — SEND REQUEST TO MULTIPLE BANKS (TRANSACTIONAL & SAFE)
// ─────────────────────────────────────────────
exports.sendRequest = async (req, res) => {
    const { hospital_id, blood_grp, units_required, priority, selected_banks } = req.body;

    if (!hospital_id || !blood_grp || !units_required || !selected_banks || !selected_banks.length) {
        return res.status(400).json({ message: "All fields including selected_banks are required" });
    }

    db.getConnection(async (err, connection) => {
        if (err) return res.status(500).json({ message: "DB connection failed", error: err.message });

        try {
            await queryAsync(connection, "START TRANSACTION");

            // Insert main request
            const mainRequest = await queryAsync(connection, `
                INSERT INTO Blood_Request_from_hospital
                (hospital_id, blood_grp, units_required, priority)
                VALUES (?, ?, ?, ?)
            `, [hospital_id, blood_grp, units_required, priority || 1]);

            const request_id = mainRequest.insertId;

            // Validate selected banks
            const placeholders = selected_banks.map(() => '?').join(',');
            const rows = await queryAsync(connection, `
                SELECT user_id FROM User WHERE user_id IN (${placeholders}) AND user_type='bank'
            `, selected_banks);

            const validBanks = rows.map(r => r.user_id);
            if (!validBanks.length || validBanks.length !== selected_banks.length) {
                await queryAsync(connection, "ROLLBACK");
                return res.status(400).json({ message: "Some selected banks do not exist" });
            }

            // Insert into Requests_sent_to_BloodBanks
            const values = validBanks.map(bank_id => [request_id, bank_id]);
            await queryAsync(connection, "INSERT INTO Requests_sent_to_BloodBanks (request_id, bank_id) VALUES ?", [values]);

            await queryAsync(connection, "COMMIT");

            res.json({ message: "Request sent successfully", request_id, banks_sent: validBanks });
        } catch (error) {
            await queryAsync(connection, "ROLLBACK");
            res.status(500).json({ message: "Failed to send request", error: error.message });
        } finally {
            connection.release();
        }
    });
};

// ─────────────────────────────────────────────
// CANCEL REQUEST (TRANSACTION)
// ─────────────────────────────────────────────
exports.cancelRequest = (req, res) => {
    const { request_id } = req.params;

    db.getConnection(async (err, connection) => {
        if (err) return res.status(500).json({ message: "DB connection failed", error: err.message });

        try {
            await queryAsync(connection, "START TRANSACTION");
            await queryAsync(connection, `UPDATE Blood_Request_from_hospital SET final_status='Cancelled' WHERE request_id=?`, [request_id]);
            await queryAsync(connection, `UPDATE Requests_sent_to_BloodBanks SET request_status='Cancelled' WHERE request_id=?`, [request_id]);
            await queryAsync(connection, "COMMIT");

            res.json({ message: "Request cancelled successfully" });
        } catch (error) {
            await queryAsync(connection, "ROLLBACK");
            res.status(500).json({ message: "Cancel failed", error: error.message });
        } finally {
            connection.release();
        }
    });
};

// ─────────────────────────────────────────────
// FULFILL REQUEST (TRANSACTION)
// ─────────────────────────────────────────────
exports.fulfillRequest = (req, res) => {
    const { request_id, bank_id } = req.params;

    db.getConnection(async (err, connection) => {
        if (err) return res.status(500).json({ message: "DB connection failed", error: err.message });

        try {
            await queryAsync(connection, "START TRANSACTION");

            const rows = await queryAsync(connection, `SELECT blood_grp, units_required FROM Blood_Request_from_hospital WHERE request_id=?`, [request_id]);
            if (!rows.length) throw new Error("Request not found");

            const { blood_grp, units_required } = rows[0];

            await queryAsync(connection, `
                UPDATE Blood_Stock
                SET units_available = units_available - ?
                WHERE bank_id=? AND blood_grp=?
            `, [units_required, bank_id, blood_grp]);

            await queryAsync(connection, `
                INSERT INTO Blood_issued_to_hospital (bank_id, blood_grp, units_issued, request_id)
                VALUES (?,?,?,?)
            `, [bank_id, blood_grp, units_required, request_id]);

            await queryAsync(connection, `UPDATE Blood_Request_from_hospital SET final_status='Approved' WHERE request_id=?`, [request_id]);
            await queryAsync(connection, `UPDATE Requests_sent_to_BloodBanks SET request_status='Approved' WHERE request_id=? AND bank_id=?`, [request_id, bank_id]);
            await queryAsync(connection, `UPDATE Requests_sent_to_BloodBanks SET request_status='Cancelled' WHERE request_id=? AND bank_id!=?`, [request_id, bank_id]);

            await queryAsync(connection, "COMMIT");

            res.json({ message: "Blood issued successfully" });
        } catch (error) {
            await queryAsync(connection, "ROLLBACK");
            res.status(500).json({ message: "Fulfill failed", error: error.message });
        } finally {
            connection.release();
        }
    });
};

// ─────────────────────────────────────────────
// REJECT REQUEST (TRANSACTION)
// ─────────────────────────────────────────────
exports.rejectRequest = (req, res) => {
    const { request_id, bank_id } = req.params;

    db.getConnection(async (err, connection) => {
        if (err) return res.status(500).json({ message: "DB connection failed", error: err.message });

        try {
            await queryAsync(connection, "START TRANSACTION");
            await queryAsync(connection, `UPDATE Requests_sent_to_BloodBanks SET request_status='Rejected' WHERE request_id=? AND bank_id=?`, [request_id, bank_id]);
            await queryAsync(connection, "COMMIT");

            res.json({ message: "Request rejected successfully" });
        } catch (error) {
            await queryAsync(connection, "ROLLBACK");
            res.status(500).json({ message: "Reject failed", error: error.message });
        } finally {
            connection.release();
        }
    });
};

// ─────────────────────────────────────────────
// GET HOSPITAL REQUESTS
// ─────────────────────────────────────────────
exports.getHospitalRequests = (req, res) => {
    const { hospital_id } = req.params;

    db.query(`
        SELECT * FROM Blood_Request_from_hospital
        WHERE hospital_id=?
        ORDER BY requested_date DESC
    `, [hospital_id], (err, result) => {
        if (err) return res.status(500).json({ message: "Error fetching requests", error: err.message });
        res.json(result);
    });
};

// ─────────────────────────────────────────────
// GET INCOMING REQUESTS FOR BLOOD BANK
// ─────────────────────────────────────────────
exports.getIncomingRequests = (req, res) => {
    const { bank_id } = req.params;

    db.query(`
        SELECT r.request_id, r.blood_grp, r.units_required, r.priority,
               r.hospital_id, u.name AS hospital_name, s.request_status
        FROM Requests_sent_to_BloodBanks s
        JOIN Blood_Request_from_hospital r ON s.request_id = r.request_id
        JOIN User u ON r.hospital_id = u.user_id
        WHERE s.bank_id=?
    `, [bank_id], (err, result) => {
        if (err) return res.status(500).json({ message: "Error fetching requests", error: err.message });
        res.json(result);
    });
};