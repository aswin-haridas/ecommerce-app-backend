const CryptoJS = require("crypto-js");
const User = require("../models/User");
const express = require("express");
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const ciphertext = CryptoJS.AES.encrypt(
      req.body.password.toString(),
      process.env.SECRET_KEY
    ).toString();

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: ciphertext,
    });
    await newUser.save();
    res.status(200).json({ Status: "Success", user: newUser });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const bytes = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
      const originalPassword = bytes.toString(CryptoJS.enc.Utf8);
      if (originalPassword === req.body.password.toString()) {
        res.json({ Status: "success", user: user });
      } else {
        res.json({ Status: "Invalid password" });
      }
    } else {
      res.json({ Status: "Email not existing" });
    }
  } catch (err) {
    res.json({ Error: "Error" });
  }
});

module.exports = router;
