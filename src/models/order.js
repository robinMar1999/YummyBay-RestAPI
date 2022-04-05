import mongoose from "mongoose";

const { Schema, model, SchemaTypes } = mongoose;

const orderSchema = new Schema(
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
    delivery: {
      type: SchemaTypes.ObjectId,
      ref: "user",
      default: null,
    },
    dishes: [
      {
        dish: {
          type: SchemaTypes.ObjectId,
          ref: "dish",
        },
        count: {
          type: Number,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: Number, // 0 means order placed, 1 means handed, 2 means delivered
      default: 0,
    },
  },
  { timestamps: true }
);

const Order = model("order", orderSchema);

export default Order;
