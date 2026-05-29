import { connect } from "mongoose";
import { Transaction } from "./models/Transaction.js";

export const connectDb = async () => {
  const DB_URL = process.env.DB_URL;
  try {
    await connect(DB_URL);
    await Transaction.syncIndexes();
    console.log("Connected to DB successfully.");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
