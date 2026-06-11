import { Transaction } from "../db/models/Transaction.js";
import {
  deleteTransactionService,
  getTransactionByIdService,
  getTransactionsService,
  postTransactionService,
  updateTransactionService,
} from "../services/transactionServices.js";
import createHttpError from "http-errors";

export const getTransactions = async (req, res) => {
  const { page, perPage, sortBy, sortOrder, search, startDate, endDate } =
    req.query;

  const response = await getTransactionsService({
    page,
    perPage,
    sortBy,
    sortOrder,
    search,
    startDate,
    endDate,
    authorId: req.user?._id,
  });

  res.json(response);
};

export const getTransactionByID = async (req, res) => {
  const { id } = req.params;
  const transaction = await getTransactionByIdService(id);

  if (!transaction) {
    throw createHttpError(404, "Transaction not found");
  }

  res.json(transaction);
};

export const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  const deletedTransaction = await deleteTransactionService(id);

  if (!deletedTransaction) {
    throw createHttpError(404, "Transaction not found");
  }

  res.sendStatus(204);
};

export const postTransaction = async (req, res) => {
  const body = req.body;
  body.authorId = req.user?._id;
  const newTransaction = await postTransactionService(body);
  res.status(201).json(newTransaction);
};

export const patchTransaction = async (req, res) => {
  const body = req.body;
  const { id } = req.params;

  if (body.authorId) delete body.authorId;

  const result = await updateTransactionService(id, body);

  if (!result) {
    throw createHttpError(404, "Transaction not found");
  }

  res.json(result.data);
};

export const putTransaction = async (req, res) => {
  const body = req.body;
  const { id } = req.params;

  // ensure owner is set on upsert
  body.authorId = req.user?._id;

  const { data, isUpdated } = await updateTransactionService(id, body, {
    upsert: true,
  });

  res.status(isUpdated ? 200 : 201).json(data);
};
