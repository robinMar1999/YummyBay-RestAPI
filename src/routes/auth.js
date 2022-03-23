import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.js";
import auth from "../middlewares/auth.js";
import config from "../../config/config.js";
import sendOtp from "../../helpers/sendOtp.js";

const router = Router();

// @route   POST auth/getotp
// @desc    Get otp to verify number
// @access  Public
router.post("/getotp", async (req, res) => {
  try {
    const { email, role } = req.body;
    const { result, otp } = await sendOtp(email);
    let user = await User.findOne({ email, role });
    if (!user) {
      user = new User({
        email,
        role,
        otp,
      });
    } else {
      user.otp = otp;
    }
    await user.save();
    const payload = {
      id: user.id,
      sentAt: new Date(),
      isLoggedIn: false,
    };
    const token = jwt.sign(payload, config.jwtSecret);
    res.status(201).json({ status: 1, msg: "Otp sent successfully", token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
});

// @route   POST auth/verify
// @desc    Verify Otp
// @access  Private
router.post("/verify", auth, async (req, res) => {
  try {
    const { otp, enteredAt } = req.body;
    const { sentAt } = req.decoded;
    const enteredTime = parseInt(new Date(enteredAt).getTime());
    const sentTime = parseInt(new Date(sentAt).getTime());
    if (enteredTime - sentTime > 2 * 60 * 1000) {
      res.status(400).json({ status: 0, msg: "Sorry, You are a bit late" });
    } else {
      const user = await User.findById(req.decoded.id);
      if (!user) {
        return res.status(404).json({ status: 0, msg: "User Not Found" });
      }
      if (user.otp === otp) {
        user.verified = true;
        user.otp = null;
        await user.save();
        const payload = {
          id: user.id,
          role: user.role,
          isLoggedIn: true,
        };
        const token = jwt.sign(payload, config.jwtSecret);
        res.status(200).json({
          status: 1,
          msg: "Phone number verified successfully",
          token,
        });
      } else {
        res.status(400).json({ status: 0, msg: "Wrong otp" });
      }
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

// @route   Get auth/
// @desc    Test route to delete all users
// @access  Public
router.delete("/", async (req, res) => {
  try {
    await User.deleteMany();
    res.json({ msg: "Delete All Users!" });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Server Error" });
  }
});

export default router;
