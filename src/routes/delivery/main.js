import express from "express";

import auth from "../../middlewares/auth.js";
import Order from "../../models/order.js";

const router = express.Router();

router.get("/new-orders", auth, async (req, res) => {
  try {
    const orders = await Order.find({ status: 0, delivery: null }).populate(
      "restaurant"
    );
    return res.json({ status: 1, msg: "fetched new orders", orders });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ status: 0, msg: "Server Error" });
  }
});

router.post("/get-order/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { id: deliveryId } = req.decoded;
    const order = await Order.findById(id);
    order.delivery = deliveryId;
    await order.save();
    res.json({ status: 1, msg: "Order updated successfully", order });
  } catch (err) {}
});

router.get("/get-accepted", auth, async (req, res) => {
  try {
    const { id: deliveryId } = req.decoded;
    const orders = await Order.find({
      delivery: deliveryId,
      status: { $lt: 2 },
    });
    res.json({ status: 1, msg: "Got Accepted Orders", orders });
  } catch (err) {}
});

router.get("/get-delivered", auth, async (req, res) => {
  try {
    const { id: deliveryId } = req.decoded;
    const orders = await Order.find({
      delivery: deliveryId,
      status: 2,
    });
    res.json({ status: 1, msg: "Got Delivered Orders", orders });
  } catch (err) {}
});

router.patch("/deliver/:orderId", auth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    order.status = 2;
    await order.save();
    res.json({ status: 1, msg: "Order Delivered", order });
  } catch (err) {}
});

export default router;
