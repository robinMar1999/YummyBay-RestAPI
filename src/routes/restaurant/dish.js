import express from "express";
import multer from "multer";
import auth from "../../middlewares/auth.js";
import drive from "../../../helpers/drive.js";
import Dish from "../../models/dish.js";

const router = express.Router();
const upload = multer();

// @route   POST restaurant/dish
// @desc    Add profile for restaurant
// @access  Public
router.post("/", auth, upload.single("photo"), async (req, res) => {
  // Task - validate body
  // we will get {id, role, isLoggedIn} from req.decoded
  const { id, role } = req.decoded;
  const { name, preparationTime, price } = req.body;
  console.log(req.body);
  console.log(req.decoded);
  console.log(req.file);
  let imageDetails = null;
  if (req.file) {
    imageDetails = await drive.uploadFile(req.file);
  }
  const dish = new Dish({
    name,
    preparationTime,
    price,
    imageDetails,
    restaurantRef: id,
  });
  await dish.save();
  res.status(201).json({ status: 1, msg: "Dish created", dish });
});

// @route   GEt restaurant/dish
// @desc    Get all dishes for a restaurant
// @access  Public
router.get("/", auth, async (req, res) => {
  // Task - validate body
  // we will get {id, role, isLoggedIn} from req.decoded
  const { id, role } = req.decoded;
  console.log(req.decoded);
  const dishes = await Dish.find({ restaurantRef: id });
  res
    .status(200)
    .json({ status: 1, msg: "Dishes fetched for this restaurant", dishes });
});

router.patch("/:dishId", auth, async (req, res) => {
  try {
    // Task - Complete this route
  } catch (error) {}
});

router.delete("/:dishId", auth, async (req, res) => {
  try {
    // Task - Complete this route
  } catch (error) {}
});

export default router;
