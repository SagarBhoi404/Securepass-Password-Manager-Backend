const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const Password = require("../models/Password");
const User = require("../models/User");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Add a new password
router.post("/add", authMiddleware, async (req, res) => {
  const { account, username, password, aesKey } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    // Verify AES key
    const isKeyMatch = await bcrypt.compare(aesKey, user.aesKeyHash);
    if (!isKeyMatch) {
      return res.status(400).json({ error: true, message: "Invalid AES key" });
    }

    // Encrypt the password
    const iv = crypto.randomBytes(16).toString("hex");
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(aesKey),
      Buffer.from(iv, "hex")
    );
    let encryptedPassword = cipher.update(password, "utf8", "hex");
    encryptedPassword += cipher.final("hex");

    // Save encrypted password
    const newPassword = new Password({
      userId,
      account,
      username,
      encryptedPassword,
      iv,
    });

    await newPassword.save();
    res.json({ error: false, message: "Password saved successfully" });
  } catch (error) {
    res.status(500).json({ error: true, message: "Server error" });
    console.log(error);
  }
});

// Get all saved passwords
router.get("/", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const passwords = await Password.find({ userId }).select("-userId -__v");
    res.json(passwords);
  } catch (error) {
    res.status(500).json({ error: true, message: "Server error" });
  }
});

// Decrypt a password
router.post("/decrypt", authMiddleware, async (req, res) => {
  const { passwordId, aesKey } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: true, message: "User not found" });
    }

    const savedPassword = await Password.findById(passwordId);
    if (!savedPassword || savedPassword.userId.toString() !== userId) {
      return res
        .status(404)
        .json({ error: true, message: "Password not found" });
    }

    // Verify AES key
    const isKeyMatch = await bcrypt.compare(aesKey, user.aesKeyHash);
    if (!isKeyMatch) {
      return res.status(400).json({ error: true, message: "Invalid AES key" });
    }

    // Decrypt the password
    const decipher = crypto.createDecipheriv(
      "aes-256-cbc",
      Buffer.from(aesKey),
      Buffer.from(savedPassword.iv, "hex")
    );
    let decryptedPassword = decipher.update(
      savedPassword.encryptedPassword,
      "hex",
      "utf8"
    );
    decryptedPassword += decipher.final("utf8");

    res.json({ error: false, decryptedPassword });
  } catch (error) {
    res.status(500).json({ error: true, message: "Server error" });
  }
});

// Edit password route
router.put("/:id",authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { account, username, password, aesKey } = req.body;
  const iv = crypto.randomBytes(16).toString("hex");
  const userId = req.user.id;
  let encryptedPassword = "";
  
  try {
    if (password) {
      if (!aesKey) {
        return res
          .status(404)
          .json({
            error: true,
            message: "AES Key is required for password update.",
          });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: true, message: "User not found" });
      }

      // Verify AES key
      const isKeyMatch = await bcrypt.compare(aesKey, user.aesKeyHash);
      if (!isKeyMatch) {
        return res
          .status(400)
          .json({ error: true, message: "Invalid AES key" });
      }

      // Encrypt the password
      const cipher = crypto.createCipheriv(
        "aes-256-cbc",
        Buffer.from(aesKey),
        Buffer.from(iv, "hex")
      );
      encryptedPassword = cipher.update(password, "utf8", "hex");
      encryptedPassword += cipher.final("hex");
    }

    const updatedPassword = await Password.findByIdAndUpdate(
      id,
      { account, username, encryptedPassword, iv },
      { new: true }
    );

    if (!updatedPassword) {
      return res
        .status(404)
        .json({ error: true, message: "Password not found" });
    }

    res.json({ error: false, message: "Update Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Server error" });
  }
});

// Delete password route
router.delete("/:id", authMiddleware,async (req, res) => {
  const { id } = req.params;

  try {
    const deletedPassword = await Password.findByIdAndDelete(id);

    if (!deletedPassword) {
      return res
        .status(404)
        .json({ error: true, message: "Password not found" });
    }

    res.json({ error: false, message: "Password deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: true, message: "Server error" });
  }
});

module.exports = router;
