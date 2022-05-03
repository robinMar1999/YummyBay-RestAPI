import mongoose from "mongoose";

const { Schema, model, SchemaTypes } = mongoose;

const orderSchema = new Schema(
  {
    customerId: {
      type: SchemaTypes.ObjectId,
      ref: "user",
      required: true,
    },
    restaurantId: {
      type: SchemaTypes.ObjectId,
      ref: "user",
      required: true,
    },
    customer: {
      type: SchemaTypes.ObjectId,
      ref: "customer",
      required: true,
    },
    restaurant: {
      type: SchemaTypes.ObjectId,
      ref: "restaurant",
      required: true,
    },
    deliveryId: {
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
