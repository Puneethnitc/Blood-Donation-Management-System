const db = require("../config/db");

exports.sendRequestToBanks = (req, res) => {

  const { request_id, hospital_id, blood_grp, units_required, priority } = req.body;

  // 1️⃣ Insert request from hospital
  const insertRequest = `
  INSERT INTO Blood_Request_from_hospital
  (request_id, hospital_id, blood_grp, units_required, priority)
  VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    insertRequest,
    [request_id, hospital_id, blood_grp, units_required, priority],
    (err) => {

      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Error inserting request" });
      }

      // 2️⃣ Find blood banks that have this blood group
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

        // 3️⃣ Send request to each bank
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