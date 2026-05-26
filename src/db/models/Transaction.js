import { Schema, model } from "mongoose";

const transactionSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    note: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export const Transaction = model("Transaction", transactionSchema);
