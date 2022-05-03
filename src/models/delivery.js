import mongoose from "mongoose";

const { Schema, model } = mongoose;

const deliverySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    unique: true,
    required: true,
    ref: "user",
  },
  phone: {
    type: Number,
    required: true,
  },
});

const Delivery = model("delivery", deliverySchema);

export default Delivery;
