import { Transaction } from "../db/models/Transaction.js";
import {
  deleteTransactionsService,
  getTransactionsByIdService,
  getTransactionsService,
  postTransactionService,
  updateTransactionsService,
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
  });

  res.json(response);
};

export const getTransactionByID = async (req, res) => {
  const { id } = req.params;
  const transaction = await getTransactionsByIdService(id);

  if (!transaction) {
    throw createHttpError(404, "Transaction not found");
  }

  res.json(transaction);
};

export const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  const deletedTransaction = await deleteTransactionService(id);

  if (!deleteTransaction) {
    throw createHttpError(404, "Transaction not found");
  }

  res.sendStatus(204);
};

export const postTransaction = async (req, res) => {
  const body = req.body;
  const newTransaction = await postTransactionsService(body);
  res.status(201).json(newTransaction);
};

export const patchTransaction = async (req, res) => {
  const body = req.body;
  const { id } = req.params;

  const result = await updateTransactionsService(id, body);

  if (!result) {
    throw createHttpError(404, "Transaction not found");
  }

  res.json(result.data);
};

export const putTransaction = async (req, res) => {
  const body = req.body;
  const { id } = req.params;

  const { data, isUpdated } = await updateTransactionsService(id, body, {
    upsert: true,
  });

  res.status(isUpdated ? 200 : 201).json(data);
};
