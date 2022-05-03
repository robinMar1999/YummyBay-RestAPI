import express from "express";
import Restaurant from "../../models/restaurant.js";
import Dish from "../../models/dish.js";
import auth from "../../middlewares/auth.js";
import Order from "../../models/order.js";
import { getNamespaces } from "../../socketio/index.js";
import { getDeliveries } from "../../socketio/data/delivery.js";

const router = express.Router();

router.get("/near-me", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    return res.json({ status: 1, restaurants });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ status: 0, msg: "Server Error" });
  }
});

router.get("/details/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findOne({ user: id });
    const dishes = await Dish.find({ restaurantRef: id });
    res.json({
      status: 1,
      msg: "details fetched successfully",
      restaurant,
      dishes,
    });
  } catch (err) {}
});

router.get("/order", auth, async (req, res) => {
  try {
    const { id } = req.decoded;
    const orders = await Order.find({ restaurantId: id }).populate(
      "dishes.dish"
    );
    res.json({ status: 1, msg: "Fetched orders successfully", orders });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ status: 0, msg: "Server Error" });
  }
});

router.patch("/hand/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id).populate("dishes.dish");
    order.status = 1;
    await order.save();
    console.log(id);
    const namespaces = getNamespaces();
    const populatedOrder = await Order.findById(order._id)
      .populate("customer")
      .populate("restaurant")
      .populate("dishes.dish");
    const deliveries = getDeliveries();
    let socketId = null;
    console.log(deliveries);
    for (let delivery of deliveries) {
      if (delivery.userId === order.deliveryId.toString()) {
        socketId = delivery.socketId;
        break;
      }
    }
    console.log("socketId for delivery", socketId);
    if (socketId) {
      namespaces.delivery.to(socketId).emit("order-handed", populatedOrder);
    }
    res.json({ status: 1, msg: "order delivered", order: populatedOrder });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ status: 0, msg: "Server Error" });
  }
});

export default router;
