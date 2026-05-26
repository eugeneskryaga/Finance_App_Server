import { Router } from "express";
import {
  deleteTransaction,
  getTransactionByID,
  getTransactions,
  postTransaction,
} from "../controllers/transactionController.js";

const router = Router();

router.get("/transactions", getTransactions);
router.get("/transactions/:id", getTransactionByID);
router.post("/transactions", postTransaction);
router.delete("/transactions/:id", deleteTransaction);

export default router;
