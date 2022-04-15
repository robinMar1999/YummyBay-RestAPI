import express from "express";
import Razorpay from "razorpay";

import auth from "../../middlewares/auth.js";
import config from "../../../config/config.js";

const router = express.Router();
const razorpay = new Razorpay({
  key_id: config.RAZORPAY_ID,
  key_secret: config.RAZORPAY_SECRET,
});

router.post("/create-order", auth, async (req, res) => {
  try {
    const rzporder = await razorpay.orders.create({
      amount: req.body.amount * 100,
      currency: "INR",
    });

    console.log(rzporder);
    res.status(201).json({ status: 1, msg: "payment order created", rzporder });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ status: 0, msg: "Server Error" });
  }
});

export default router;
