import express from "express";
import connectDB from "./db/mongoose.js";
import multer from "multer";
import authRoutes from "./src/routes/auth.js";
import restaurantRoutes from "./src/routes/restaurant.js";

const app = express();
const port = process.env.PORT || 5000;

// connect to database
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ extended: false })); // to access req.body

app.use("/auth", authRoutes);
app.use("/restaurant", restaurantRoutes);

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
