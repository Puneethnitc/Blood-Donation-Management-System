const db = require("../config/db");

// helper
const queryAsync = (connection, sql, params = []) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, params, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
    });
};

// get hospital location
exports.getHospitalLocation = (hospital_id) => {
    return new Promise((resolve, reject) => {

        db.query(
            `SELECT latitude, longitude
             FROM Organization_Location
             WHERE organisation_id = ?`,
            [hospital_id],
            (err, result) => {
                if (err) reject(err);
                else resolve(result);
            }
        );
    });
};

// search banks
exports.searchBanks = (latitude, longitude, blood_grp, units_required) => {

    return new Promise((resolve, reject) => {

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

        db.query(
            query,
            [latitude, longitude, latitude, blood_grp, units_required],
            (err, result) => {
                if (err) reject(err);
                else resolve(result);
            }
        );
    });
};

// insert request
exports.createRequest = (hospital_id, blood_grp, units_required, priority) => {

    return new Promise((resolve, reject) => {

        db.query(
            `INSERT INTO Blood_Request_from_hospital
            (hospital_id, blood_grp, units_required, priority)
            VALUES (?, ?, ?, ?)`,
            [hospital_id, blood_grp, units_required, priority],
            (err, result) => {
                if (err) reject(err);
                else resolve(result);
            }
        );
    });
};

// get hospital requests
exports.getHospitalRequests = (hospital_id) => {

    return new Promise((resolve, reject) => {

        db.query(
            `SELECT *
             FROM Blood_Request_from_hospital
             WHERE hospital_id = ?
             ORDER BY requested_date DESC`,
            [hospital_id],
            (err, result) => {
                if (err) reject(err);
                else resolve(result);
            }
        );
    });
};

// cancel request
exports.cancelRequest = (request_id) => {

    return new Promise((resolve, reject) => {

        db.query(
            `UPDATE Blood_Request_from_hospital
             SET final_status='Cancelled'
             WHERE request_id=?`,
            [request_id],
            (err, result) => {
                if (err) reject(err);
                else resolve(result);
            }
        );
    });
};

// get incoming bank requests
exports.getIncomingRequests = (bank_id) => {

    return new Promise((resolve, reject) => {

        db.query(
            `
            SELECT r.request_id,
                   r.blood_grp,
                   r.units_required,
                   r.priority,
                   r.hospital_id,
                   u.name AS hospital_name,
                   s.request_status
            FROM Requests_sent_to_BloodBanks s
            JOIN Blood_Request_from_hospital r
            ON s.request_id = r.request_id
            JOIN User u
            ON r.hospital_id = u.user_id
            WHERE s.bank_id=?
            `,
            [bank_id],
            (err, result) => {
                if (err) reject(err);
                else resolve(result);
            }
        );
    });
};
exports.sendRequestToBank = (request_id, bank_id) => {

    return new Promise((resolve, reject) => {

        db.query(
            `INSERT INTO Requests_sent_to_BloodBanks
            (request_id, bank_id, request_status)
            VALUES (?, ?, 'Processing')`,
            [request_id, bank_id],
            (err, result) => {
                if (err) reject(err);
                else resolve(result);
            }
        );

    });
};