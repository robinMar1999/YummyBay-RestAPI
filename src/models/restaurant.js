import mongoose from "mongoose";

const { model, Schema } = mongoose;

const restaurantSchema = new Schema({
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
  address: {
    type: String,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  imageDetails: {
    type: Object,
  },
});

const Restaurant = model("restaurant", restaurantSchema);

export default Restaurant;
