import mongoose from "mongoose";

const { Schema, model } = mongoose;

const dishSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageDetails: {
    type: Object,
  },
  restaurantRef: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

const Dish = model("dish", dishSchema);

export default Dish;
