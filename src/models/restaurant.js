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
  ownerEmail: {
    type: String,
    required: true,
    unique: true,
  },
  invoicingEmail: {
    type: String,
    required: true,
    unique: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  ownerPhone: {
    type: Number,
    required: true,
  },
  managerPhone: {
    type: Number,
    required: true,
  },
  whatsapp: {
    type: Number,
    required: true,
  },
  bankac: {
    type: String,
    required: true,
  },
  ifsc: {
    type: String,
    required: true,
  },
  openingTime: {
    type: String,
    required: true,
  },
  closingTime: {
    type: String,
    required: true,
  },
  imageDetails: {
    type: Object,
  },
});

const Restaurant = model("restaurant", restaurantSchema);

export default Restaurant;
