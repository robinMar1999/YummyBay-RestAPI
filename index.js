import express from "express";
import connectDB from "./db/mongoose.js";
import authRoutes from "./src/routes/auth.js";
import addRestaurantRoutes from "./src/routes/restaurant/index.js";
import addCustomerRoutes from "./src/routes/customer/index.js";
import cors from "cors";

const app = express();
const port = process.env.PORT || 5000;

// connect to database
connectDB();
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: false })); // to access req.body

app.use("/auth", authRoutes);
addRestaurantRoutes(app);
addCustomerRoutes(app);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
