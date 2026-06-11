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
import { checkToken } from "../middlewares/checkToken.js";

const router = Router();

router.use(checkToken);

router.get("/", celebrate(getTransactionsSchema), getTransactions);
router.get("/:id", celebrate(idSchema), getTransactionByID);
router.post("/", celebrate(createTransactionSchema), postTransaction);
router.delete("/:id", celebrate(idSchema), deleteTransaction);
router.patch("/:id", celebrate(updateTransactionSchema), patchTransaction);
router.put(
  "/:id",
  celebrate(createTransactionSchema),
  celebrate(idSchema),
  putTransaction,
);

export default router;
