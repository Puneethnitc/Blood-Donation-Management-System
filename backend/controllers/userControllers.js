const bcrypt = require("bcrypt");
const {
  getBaseUser,
  getDonorExtra,
  getOrgLocationExtra,
  getPasswordHash,
  updatePasswordHash,
} = require("../models/userProfileModels");

const getUserProfileRoute = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const user = await getBaseUser(user_id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let extra = {};
    if (user.user_type === "donor") {
      extra = (await getDonorExtra(user_id)) || {};
    } else if (user.user_type === "hospital" || user.user_type === "blood_bank") {
      extra = (await getOrgLocationExtra(user_id)) || {};
    }

    return res.json({
      success: true,
      data: {
        ...user,
        extra,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const changePasswordRoute = async (req, res) => {
  try {
    const user_id = req.user.user_id;
    const { old_password, new_password } = req.body || {};

    if (!old_password || !new_password) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    if (String(new_password).length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    const password_hash = await getPasswordHash(user_id);
    if (!password_hash) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const ok = await bcrypt.compare(String(old_password), password_hash);
    if (!ok) {
      return res.status(400).json({ success: false, message: "Old password is incorrect" });
    }

    const nextHash = await bcrypt.hash(String(new_password), 10);
    await updatePasswordHash(user_id, nextHash);

    return res.json({
      success: true,
      message: "Password updated successfully",
      notification: { type: "success", text: "Password updated successfully" },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  getUserProfileRoute,
  changePasswordRoute,
};

