import mongoose from "mongoose";

const { Schema, model } = mongoose;

const customerSchema = new Schema({
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
});

const Customer = model("customer", customerSchema);

export default Customer;
