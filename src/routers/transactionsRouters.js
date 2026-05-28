import { Router } from "express";
import { celebrate } from "celebrate";
import {
  createTransactionSchema,
  getTransactionsSchema,
  idSchema,
  updateTransactionSchema,
} from "../validation/transactionValidation.js";
import {
  deleteTransaction,
  getTransactionByID,
  getTransactions,
  patchTransaction,
  postTransaction,
  putTransaction,
} from "../controllers/transactionControllers.js";

const router = Router();

router.get("/transactions", celebrate(getTransactionsSchema), getTransactions);
router.get("/transactions/:id", celebrate(idSchema), getTransactionByID);
router.post(
  "/transactions",
  celebrate(createTransactionSchema),
  postTransaction,
);
router.delete("/transactions/:id", celebrate(idSchema), deleteTransaction);
router.patch(
  "/transactions/:id",
  celebrate(updateTransactionSchema),
  patchTransaction,
);
router.put(
  "/transactions/:id",
  celebrate(createTransactionSchema),
  celebrate(idSchema),
  putTransaction,
);

export default router;
