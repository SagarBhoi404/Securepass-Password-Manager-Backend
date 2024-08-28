const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Register a new user
router.post("/register", async (req, res) => {
  const { email, password, aesKey } = req.body;

  if (!email || !password || !aesKey) {
    return res
      .status(400)
      .json({ error: true, message: "All Fields Required." });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ error: true, message: "User already exists" });
    }

    // Hash passwords
    const passwordHash = await bcrypt.hash(password, 10);
    const aesKeyHash = await bcrypt.hash(aesKey, 10);

    // Create new user
    user = new User({
      email,
      passwordHash,
      aesKeyHash,
    });

    await user.save();

    // Generate JWT
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ error: false, message: "Register Successfully.", token });
  } catch (error) {
    res.status(500).json({ error: false, message: "Server error" });
    console.log(error);
  }
});

// Login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: true, message: "All Fields Required." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid credentials" });
    }

    // Generate JWT
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ error: false, token });
  } catch (error) {
    res.status(500).json({ error: true, message: "Server error" });
  }
});

// Get current user details
router.get("/user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-passwordHash -aesKeyHash"
    ); // Exclude sensitive data

    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    res.json({ error: false, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Server error" });
  }
});

// Update password
router.put("/user/password", authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: true, message: "All Fields Required." });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    // Check if the current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res
        .status(400)
        .json({ error: true, message: "Incorrect current password" });
    }

    // Hash the new password and update
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);

    await user.save();
    res.json({ error: false, message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Server error" });
  }
});

// Update AES key
router.put("/user/aeskey", authMiddleware, async (req, res) => {
  const { currentaesKey, newaesKey } = req.body;

  try {
    if (!currentaesKey || !newaesKey) {
      return res
        .status(400)
        .json({ error: true, message: "All Fields Required." });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    // Check if the current password is correct
    const isMatch = await bcrypt.compare(currentaesKey, user.aesKeyHash);
    if (!isMatch) {
      return res
        .status(400)
        .json({ error: true, message: "Incorrect current AES Key" });
    }

    // Hash the new password and update
    const salt = await bcrypt.genSalt(10);
    user.aesKeyHash = await bcrypt.hash(newaesKey, salt);

    await user.save();
    res.json({ error: false, message: "AES key updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Server error" });
  }
});

module.exports = router;
