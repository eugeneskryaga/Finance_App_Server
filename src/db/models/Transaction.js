import { Schema, model } from "mongoose";
import { CATEGORIES, TYPES } from "../../constants/index.js";

const transactionSchema = new Schema(
  {
    type: {
      type: String,
      enum: TYPES,
      required: true,
    },
    category: {
      type: String,
      enum: [...CATEGORIES.income, ...CATEGORIES.expenses],
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

transactionSchema.index({
  type: "text",
  category: "text",
  note: "text",
  date: 1,
});

export const Transaction = model("Transaction", transactionSchema);
