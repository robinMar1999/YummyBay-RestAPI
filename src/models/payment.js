import mongoose from "mongoose";

const { Schema, model, SchemaTypes } = mongoose;

const paymentSchema = new Schema(
  {
    customer: {
      type: SchemaTypes.ObjectId,
      ref: "user",
      required: true,
    },
    restaurant: {
      type: SchemaTypes.ObjectId,
      ref: "user",
      required: true,
    },
    order: {
      type: SchemaTypes.ObjectId,
      ref: "order",
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    razorpayData: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

const Payment = model("payment", paymentSchema);

export default Payment;
