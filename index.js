import express from "express";
import connectDB from "./db/mongoose.js";
import authRoutes from "./src/routes/auth.js";
import addRestaurantRoutes from "./src/routes/restaurant/index.js";
import addCustomerRoutes from "./src/routes/customer/index.js";
import addDeliveryRoutes from "./src/routes/delivery/index.js";
import cors from "cors";
import http from "http";
import decodeToken from "./helpers/decodeToken.js";
import { createIO, getNamespaces } from "./src/socketio/index.js";
import {
  getCustomers,
  addCustomer,
  removeCustomer,
} from "./src/socketio/data/customer.js";
import {
  getRestaurants,
  addRestaurant,
  removeRestaurant,
} from "./src/socketio/data/restaurant.js";
import {
  getDeliveries,
  addDelivery,
  removeDelivery,
} from "./src/socketio/data/delivery.js";

const app = express();

const server = http.createServer(app);

const io = createIO(server);

const namespaces = getNamespaces();

const port = process.env.PORT || 5000;

// connect to database
connectDB();
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: false })); // to access req.body

app.use("/auth", authRoutes);
addRestaurantRoutes(app);
addCustomerRoutes(app);
addDeliveryRoutes(app);

server.listen(port, () => {
  console.log("Server started on port " + port);
});

namespaces.customer.on("connection", (socket) => {
  const decoded = decodeToken(socket.handshake.auth.token);
  addCustomer(decoded, socket.id);
  console.log(getCustomers());
  console.log("a new customer connected", socket.id);
  socket.on("disconnect", (reason) => {
    console.log(`user with socket id ${socket.id} has been disconnected`);
    removeCustomer(socket.id);
    console.log(getCustomers());
  });
});

namespaces.restaurant.on("connection", (socket) => {
  const decoded = decodeToken(socket.handshake.auth.token);
  addRestaurant(decoded, socket.id);
  console.log(getRestaurants());
  console.log("a new restaurant connected", socket.id);
  socket.on("disconnect", (reason) => {
    console.log(`user with socket id ${socket.id} has been disconnected`);
    removeRestaurant(socket.id);
    console.log(getRestaurants());
  });
});

namespaces.delivery.on("connection", (socket) => {
  const decoded = decodeToken(socket.handshake.auth.token);
  addDelivery(decoded, socket.id);
  console.log(getDeliveries());
  console.log("a new delivery connected", socket.id);
  socket.on("disconnect", (reason) => {
    console.log(`user with socket id ${socket.id} has been disconnected`);
    removeDelivery(socket.id);
    console.log(getDeliveries());
  });
});
