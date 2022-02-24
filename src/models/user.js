import mongoose from "mongoose";

const { model, Schema } = mongoose;

const userSchema = new Schema({
  phoneNumber: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
    default: null,
  },
});

const User = model("user", userSchema);

export default User;
