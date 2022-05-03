import express from "express";

import auth from "../../middlewares/auth.js";
import Order from "../../models/order.js";
import Payment from "../../models/payment.js";
import Customer from "../../models/customer.js";
import Restaurant from "../../models/restaurant.js";
import { getNamespaces } from "../../socketio/index.js";
import { getRestaurants } from "../../socketio/data/restaurant.js";

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const { id } = req.decoded;
    const { cartItems, restaurantId, paymentData } = req.body;
    const dishes = [];
    let totalPrice = 0;
    cartItems.forEach((item) => {
      dishes.push({
        dish: item.dish._id,
        count: item.count,
      });
      totalPrice += item.dish.price * item.count;
    });
    const customerProfile = await Customer.findOne({ user: id });
    const restaurantProfile = await Restaurant.findOne({ user: restaurantId });
    const order = new Order({
      customerId: id,
      restaurantId: restaurantId,
      customer: customerProfile._id,
      restaurant: restaurantProfile._id,
      dishes,
      totalPrice,
    });
    console.log(order);
    const payment = new Payment({
      customer: id,
      restaurant: restaurantId,
      order: order._id,
      totalPrice,
      razorpayData: paymentData,
    });
    await order.save();
    await payment.save();
    const namespaces = getNamespaces();
    const populatedOrder = await Order.findById(order._id)
      .populate("customer")
      .populate("restaurant")
      .populate("dishes.dish");
    console.log(populatedOrder);
    let socketId = null;
    const restaurants = getRestaurants();
    for (let restaurant of restaurants) {
      if (restaurant.userId === restaurantId) {
        socketId = restaurant.socketId;
        break;
      }
    }
    console.log("socketId for restaurant", socketId);
    if (socketId) {
      namespaces.restaurant.to(socketId).emit("new-order", populatedOrder);
    }

    namespaces.delivery.emit("new-order", populatedOrder);
    res.json({ status: 1, msg: "Order placed", orderDetails: order });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ status: 0, msg: "Server Error" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const { id } = req.decoded;
    const orders = await Order.find({ customerId: id }).populate("dishes.dish");
    res.json({ status: 1, msg: "Fetched orders successfully", orders });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ status: 0, msg: "Server Error" });
  }
});

export default router;
