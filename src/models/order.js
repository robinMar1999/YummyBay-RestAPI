import mongoose from "mongoose";

const { Schema, model } = mongoose;

const orderSchema = new Schema({});

const Order = model("order", orderSchema);
