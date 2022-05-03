import express from "express";

import auth from "../../middlewares/auth.js";
import Order from "../../models/order.js";
import { getNamespaces } from "../../socketio/index.js";
import { getCustomers } from "../../socketio/data/customer.js";
import { getRestaurants } from "../../socketio/data/restaurant.js";

const router = express.Router();

router.get("/new-orders", auth, async (req, res) => {
  try {
    const orders = await Order.find({ status: 0, deliveryId: null })
      .populate("customer")
      .populate("restaurant")
      .populate("dishes.dish");
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

    order.deliveryId = deliveryId;
    await order.save();
    const populatedOrder = await Order.findById(order._id)
      .populate("customer")
      .populate("restaurant")
      .populate("dishes.dish");
    const namespaces = getNamespaces();
    let socketId = null;
    const restaurants = getRestaurants();
    console.log(restaurants);
    for (let restaurant of restaurants) {
      if (restaurant.userId === order.restaurantId.toString()) {
        socketId = restaurant.socketId;
        break;
      }
    }
    console.log("socketId for restaurant", socketId);
    if (socketId) {
      namespaces.restaurant
        .to(socketId)
        .emit("delivery-available", populatedOrder);
    }
    namespaces.delivery.emit("order-aquired", populatedOrder);
    res.json({
      status: 1,
      msg: "Order updated successfully",
      order: populatedOrder,
    });
  } catch (err) {}
});

router.get("/get-accepted", auth, async (req, res) => {
  try {
    const { id: deliveryId } = req.decoded;
    const orders = await Order.find({
      deliveryId: deliveryId,
      status: { $lt: 2 },
    })
      .populate("customer")
      .populate("restaurant")
      .populate("dishes.dish");
    res.json({ status: 1, msg: "Got Accepted Orders", orders });
  } catch (err) {}
});

router.get("/get-delivered", auth, async (req, res) => {
  try {
    const { id: deliveryId } = req.decoded;
    const orders = await Order.find({
      delivery: deliveryId,
      status: 2,
    })
      .populate("customer")
      .populate("restaurant")
      .populate("dishes.dish");
    res.json({ status: 1, msg: "Got Delivered Orders", orders });
  } catch (err) {}
});

router.patch("/deliver/:orderId", auth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    order.status = 2;
    await order.save();
    const populatedOrder = await Order.findById(order._id)
      .populate("customer")
      .populate("restaurant")
      .populate("dishes.dish");
    const namespaces = getNamespaces();
    const customers = getCustomers();
    let socketId = null;
    for (let customer of customers) {
      if (customer.userId === order.customerId.toString()) {
        socketId = customer.socketId;
      }
    }
    console.log("customer socket id", socketId);
    if (socketId) {
      namespaces.customer.to(socketId).emit("order-delivered", populatedOrder);
    }

    res.json({ status: 1, msg: "Order Delivered", order: populatedOrder });
  } catch (err) {}
});

export default router;
