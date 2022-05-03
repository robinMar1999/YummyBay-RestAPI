import express from "express";
import auth from "../../middlewares/auth.js";
import Delivery from "../../models/delivery.js";
import User from "../../models/user.js";
import multer from "multer";

const router = express.Router();
const upload = multer();

router.post("/", auth, upload.array(), async (req, res) => {
  try {
    const { id } = req.decoded;
    const user = await User.findById(id);
    console.log(id, req.body);

    const delivery = new Delivery({
      ...req.body,
      user: id,
    });
    await delivery.save();
    user.isProfileAdded = true;
    await user.save();
    res.json(delivery);
  } catch (err) {}
});

router.put("/", auth, upload.array(), async (req, res) => {
  try {
    const { id } = req.decoded;
    const delivery = await Delivery.findOne({ user: id });
    if (!delivery) {
      return res.status(404).json({ msg: "Delivery Person Not Found!" });
    }
    console.log(id, req.body);
    for (let key in req.body) {
      delivery[key] = req.body[key];
    }
    await delivery.save();
    res.json(delivery);
  } catch (err) {}
});

export default router;
