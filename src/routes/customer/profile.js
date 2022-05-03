import express from "express";
import auth from "../../middlewares/auth.js";
import Customer from "../../models/customer.js";
import User from "../../models/user.js";
import multer from "multer";

const router = express.Router();
const upload = multer();

router.post("/", auth, upload.array(), async (req, res) => {
  try {
    const { id } = req.decoded;
    const user = await User.findById(id);

    console.log(id, req.body);

    const customer = new Customer({
      ...req.body,
      user: id,
    });
    await customer.save();
    user.isProfileAdded = true;
    await user.save();
    res.json(customer);
  } catch (err) {}
});

router.put("/", auth, upload.array(), async (req, res) => {
  try {
    const { id } = req.decoded;
    const customer = await Customer.findOne({ user: id });
    if (!customer) {
      return res.status(404).json({ msg: "Customer Not Found!" });
    }
    console.log(id, req.body);
    for (let key in req.body) {
      customer[key] = req.body[key];
    }
    await customer.save();
    res.json(customer);
  } catch (err) {}
});

export default router;
