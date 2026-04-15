const { createUser } = require("../models/userModels");

const signupUser = async (req, res) => {
<<<<<<< HEAD
  console.log(req.body);
  try {
    const { name, email, phone_no, password, user_type } = req.body;
=======
  try {
    const rawName = req.body?.name;
    const rawEmail = req.body?.email;
    const rawPhone = req.body?.phone_no;
    const rawPassword = req.body?.password;
    const rawUserType = req.body?.user_type;

    const name = typeof rawName === "string" ? rawName.trim() : "";
    const email = typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "";
    const phone_no = typeof rawPhone === "string" ? rawPhone.trim() : "";
    const password = typeof rawPassword === "string" ? rawPassword.trim() : "";
    const user_type = typeof rawUserType === "string" ? rawUserType.trim() : "";
    const allowedUserTypes = ["donor", "hospital", "blood_bank", "admin"];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
>>>>>>> Krishna

    if (!name || !email || !password || !user_type) {
      return res.status(400).json({ message: "Missing required fields" });
    }
<<<<<<< HEAD

    const user = await createUser({
=======
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    if (!allowedUserTypes.includes(user_type)) {
      return res.status(400).json({ message: "Invalid user type" });
    }

    const created = await createUser({
>>>>>>> Krishna
      name,
      email,
      phone_no,
      password,
      user_type,
    });

<<<<<<< HEAD
    res.status(201).json({
      message: "User registered successfully",
      user,
=======
    // server generates ids; enforce prefix correctness
    if (user_type === "admin" && !created.user_id.startsWith("ADM")) {
      return res.status(400).json({ message: "Admin ID must start with ADM" });
    }

    res.status(201).json({
      message: "User registered successfully",
      success:true,
      user_id: created.user_id
>>>>>>> Krishna
    });

  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
<<<<<<< HEAD
        message: "Email or phone already exists",
=======
        message: "Email already exists",
>>>>>>> Krishna
      });
    }
    console.log("SIGNUP ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = signupUser;