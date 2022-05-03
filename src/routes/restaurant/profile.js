import express from "express";
import multer from "multer";
import drive from "../../../helpers/drive.js";
import {
  validateRestaurantRegisterBody,
  validateRestaurantUpdateBody,
} from "../../middlewares/validate.js";
import Restaurant from "../../models/restaurant.js";
import User from "../../models/user.js";
import auth from "../../middlewares/auth.js";

const router = express.Router();
const upload = multer();

// @route   POST restaurant/profile
// @desc    Add profile for restaurant
// @access  Public
router.post("/", auth, upload.single("photo"), async (req, res) => {
  try {
    const { id } = req.decoded;
    console.log(id);
    const user = await User.findById(id);
    let result = null;
    if (req.file) {
      result = await drive.uploadFile(req.file);
    }
    console.log(result);
    const restaurant = new Restaurant({
      ...req.body,
      imageDetails: result,
      user: id,
    });

    await restaurant.save();
    user.isProfileAdded = true;
    await user.save();
    res.json(restaurant);
  } catch (err) {
    console.log(err);
    console.log(err.message);
    res.status(500).json({ msg: "Server Error!" });
  }
});

// @route   PATCH restaurant/profile
// @desc    Update Restaurant
// @access  Public
router.patch("/", auth, upload.array(), async (req, res) => {
  try {
    const { id } = req.decoded;
    const restaurant = await Restaurant.findOne({ user: id });

    if (!restaurant) {
      return res.status(404).json({ msg: "Restaurant Not Found!" });
    }
    for (let key in req.body) {
      restaurant[key] = req.body[key];
    }
    await restaurant.save();
    res.json(restaurant);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: "Server Error!" });
  }
});

// @route   PATCH restaurant/profile/photo
// @desc    Update Restaurant
// @access  Public
router.patch("/photo", auth, upload.single("photo"), async (req, res) => {
  try {
    const { id } = req.decoded;
    const restaurant = await Restaurant.findOne({ user: id });
    if (!restaurant) {
      return res.status(404).json({ msg: "Restaurant Not Found!" });
    }
    if (req.file) {
      const photoId = restaurant.imageDetails.id;
      let delResponse = null;
      if (photoId) {
        delResponse = await drive.deleteFile(photoId);
      }
      console.log(delResponse);
      restaurant.imageDetails = await drive.uploadFile(req.file);
    }
    await restaurant.save();
    res.json(restaurant);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ msg: "Server Error!" });
  }
});

export default router;
