import express from "express";
import multer from "multer";
import drive from "../../helpers/drive.js";
import {
  validateRestaurantRegisterBody,
  validateRestaurantUpdateBody,
} from "../middlewares/validate.js";
import Restaurant from "../models/restaurant.js";

const router = express.Router();
const upload = multer();

// @route   POST restaurant/register
// @desc    Register Restaurant
// @access  Public
router.post(
  "/register",
  upload.single("photo"),
  validateRestaurantRegisterBody,
  async (req, res) => {
    try {
      let result = null;
      console.log(req.file);
      if (req.file) {
        result = await drive.uploadFile(req.file);
      }
      const restaurant = new Restaurant({
        ...req.body,
        imageDetails: result,
      });
      await restaurant.save();
      res.json(restaurant);
    } catch (err) {
      console.log(err.message);
      res.status(500).json({ msg: "Server Error!" });
    }
  }
);

// @route   PATCH restaurant/update
// @desc    Update Restaurant
// @access  Public
router.patch(
  "/update/:id",
  upload.single("photo"),
  validateRestaurantUpdateBody,
  async (req, res) => {
    try {
      const restaurant = await Restaurant.findById(req.params.id);
      if (!restaurant) {
        return res.status(404).json({ msg: "Restaurant Not Found!" });
      }
      for (let key in req.body) {
        restaurant[key] = req.body[key];
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
  }
);

export default router;
