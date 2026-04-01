const db = require("../config/db");
const bcrypt = require("bcrypt");

// 🔹 Generate User ID (USR + timestamp)
const generateUserId = (user_type) => {
  let prefix = "";

  switch (user_type) {
    case "donor":
      prefix = "DNR";
      break;
    case "hospital":
      prefix = "HSP";
      break;
    case "blood_bank":
      prefix = "BNK";
      break;
    default:
      prefix = "USR";
  }

  return prefix + Date.now().toString().slice(-6); // Example: HSP839201 , ensures uniqueness
};

// 🔹 Find user by email OR user_id
const findUserByIdentifier = (identifier) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM User 
      WHERE email = ? OR user_id = ?
    `;

    db.query(query, [identifier, identifier], (err, results) => {
      if (err)
        {
          console.log("DB ERROR:", err);
          return reject(err);
        }
      resolve(results[0]); // return single user
    });
  });
};

// 🔹 Create new user
const createUser = ({ name, email, phone_no, password, user_type }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user_id = generateUserId(user_type); // use role here
      const hashedPassword = await bcrypt.hash(password, 10);

      const query = `
        INSERT INTO \`User\` 
        (user_id, name, email, phone_no, user_type, password_hash, created_dt)
        VALUES (?, ?, ?, ?, ?, ?, CURDATE())
      `;

      db.query(
        query,
        [user_id, name, email, phone_no, user_type, hashedPassword],
        (err, result) => {
          if (err) return reject(err);

          resolve({
            user_id,
            name,
            email,
            user_type,
          });
        }
      );
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  findUserByIdentifier,
  createUser,
};