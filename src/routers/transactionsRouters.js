import { Router } from "express";
import {
  deleteTransaction,
  getTransactionByID,
  getTransactions,
  patchTransaction,
  postTransaction,
  putTransaction,
} from "../controllers/transactionControllers.js";

const router = Router();

router.get("/transactions", getTransactions);
router.get("/transactions/:id", getTransactionByID);
router.post("/transactions", postTransaction);
router.delete("/transactions/:id", deleteTransaction);
router.patch("/transactions/:id", patchTransaction);
router.put("/transactions/:id", putTransaction);

export default router;
