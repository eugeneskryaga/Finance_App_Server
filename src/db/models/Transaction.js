import { Schema, model } from "mongoose";
import { CATEGORIES, TYPES } from "../../constants/index.js";

const transactionSchema = new Schema(
  {
    type: {
      // "income", "expense"
      type: String,
      enum: TYPES,
      required: true,
    },
    category: {
      // "living","food","habits","road","entertainment","hobbies","subscriptions","donations", "shopping", "salary","freelance",
      type: String,
      enum: CATEGORIES,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    note: {
      type: String,
    },
    // date: {
    //   type: Date,
    //   required: true,
    // },
  },
  { timestamps: true, versionKey: false },
);

export const Transaction = model("Transaction", transactionSchema);
