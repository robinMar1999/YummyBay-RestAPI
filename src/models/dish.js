import mongoose from "mongoose";

const { Schema, model } = mongoose;

const dishSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  preparationTime: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  restaurantRef: {
    type: Schema.Types.ObjectId,
    ref: "restaurant",
    required: true,
  },
});

const Dish = model("dish", dishSchema);

export default Dish;
