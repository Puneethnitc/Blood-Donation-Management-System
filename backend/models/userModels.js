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
<<<<<<< HEAD
    default:
      prefix = "USR";
=======
      case "admin":
        prefix="ADM";
>>>>>>> Krishna
  }

  return prefix + Date.now().toString().slice(-6); // Example: HSP839201 , ensures uniqueness
};

// 🔹 Find user by email OR user_id
<<<<<<< HEAD
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
=======
const findUserByIdentifier = async (identifier) => {
  const [rows]=await db.promise().query(
    "select * from \`User\` where user_id=? or email=?",[identifier,identifier]
  )
  return rows[0];
};

// 🔹 Create new user
const createUser =async ({ name, email, phone_no, password, user_type }) => {
    const user_id=generateUserId(user_type)
    const password_hash= await bcrypt.hash(password,10)

    const [rows]=await db.promise().query(
      "insert into \`User\` (user_id,name,email,phone_no,password_hash,user_type,created_dt) values(?,?,?,?,?,?,CURDATE())",
      [user_id,name,email,phone_no,password_hash,user_type]
    )
    return { user_id, result: rows };
>>>>>>> Krishna
};

module.exports = {
  findUserByIdentifier,
  createUser,
};