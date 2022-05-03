import express from "express";
import multer from "multer";
import auth from "../../middlewares/auth.js";
import drive from "../../../helpers/drive.js";
import Dish from "../../models/dish.js";

const router = express.Router();
const upload = multer();

// @route   POST restaurant/dish
// @desc
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

router.patch("/:dishId", auth, upload.array(), async (req, res) => {
  try {
    // Task - Complete this route
    const { id } = req.decoded;
    const dish = await Dish.findById(req.params.dishId);
    if (!dish) {
      res.status(404).json({ status: 0, msg: "Dish Not Found" });
    }
    if (dish.restaurantRef.toString() !== id) {
      res.status(401).json({ status: 0, msg: "Unauthorized Access" });
    }
    console.log(req.body);
    for (let key in req.body) {
      dish[key] = req.body[key];
    }
    await dish.save();
    res.json({ status: 1, msg: "Dish updated", dish });
  } catch (err) {
    console.log(err);
    console.log(err.message);
    res.status(500).json({ msg: "Server Error!" });
  }
});

router.patch(
  "/:dishId/photo",
  auth,
  upload.single("photo"),
  async (req, res) => {
    try {
      // Task - Complete this route
      const { id } = req.decoded;
      console.log(req.params);
      const dish = await Dish.findById(req.params.dishId);
      if (!dish) {
        res.status(404).json({ status: 0, msg: "Dish Not Found" });
      }
      if (dish.restaurantRef.toString() !== id) {
        res.status(401).json({ status: 0, msg: "Unauthorized Access" });
      }
      if (req.file) {
        const photoId = dish.imageDetails.id;
        let delResponse = null;
        if (photoId) {
          delResponse = await drive.deleteFile(photoId);
        }
        console.log(delResponse);
        dish.imageDetails = await drive.uploadFile(req.file);
      }
      await dish.save();
      res.json({ status: 1, msg: "Dish updated", dish });
    } catch (err) {
      console.log(err);
      console.log(err.message);
      res.status(500).json({ msg: "Server Error!" });
    }
  }
);

router.delete("/:dishId", auth, async (req, res) => {
  try {
    // Task - Complete this route
  } catch (error) {}
});

export default router;
