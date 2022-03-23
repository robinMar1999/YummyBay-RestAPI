import mongoose from "mongoose";

const { Schema, model } = mongoose;

const customerSchema = new Schema({});

const Customer = model("customer", customerSchema);

export default Customer;
