import express from "express";
import auth from "../../middlewares/auth.js";
import Order from "../../models/order.js";

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const { id } = req.decoded;
    const { cartItems, restaurantId } = req.body;
    const dishes = [];
    let totalPrice = 0;
    cartItems.forEach((item) => {
      dishes.push({
        dish: item.dish._id,
        count: item.count,
      });
      totalPrice += item.dish.price * item.count;
    });
    const order = new Order({
      customer: id,
      restaurant: restaurantId,
      dishes,
      totalPrice,
    });
    await order.save();
    res.json({ status: 1, msg: "Order placed", orderDetails: order });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ status: 0, msg: "Server Error" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const { id } = req.decoded;
  } catch (err) {}
});

export default router;
