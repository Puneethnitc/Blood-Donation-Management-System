const db = require("../config/db");

exports.sendRequestToBanks = (req, res) => {

  const { hospital_id, blood_grp, units_required, priority } = req.body;

  const insertRequest = `
  INSERT INTO Blood_Request_from_hospital
  (hospital_id, blood_grp, units_required, priority)
  VALUES (?, ?, ?, ?)
  `;

  db.query(
    insertRequest,
    [hospital_id, blood_grp, units_required, priority || 1],
    (err, result) => {

      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Error inserting request", error: err.message, sqlMessage: err.sqlMessage });
       }

      const request_id = result.insertId;

      const findBanks = `
      SELECT DISTINCT bank_id
      FROM Blood_Stock
      WHERE blood_grp = ? AND units_available > 0
      `;

      db.query(findBanks, [blood_grp], (err, banks) => {

        if (err) {
          return res.status(500).json({ message: "Error finding banks" });
        }

        if (banks.length === 0) {
          return res.json({ message: "No banks have this blood group" });
        }

        banks.forEach((bank) => {

          const sendRequest = `
          INSERT INTO Requests_sent_to_BloodBanks
          (request_id, bank_id)
          VALUES (?, ?)
          `;

          db.query(sendRequest, [request_id, bank.bank_id]);

        });

        res.json({
          message: "Request sent to blood banks successfully"
        });

      });

    }
  );

};