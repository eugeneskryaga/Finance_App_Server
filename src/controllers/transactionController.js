import { Transaction } from "../db/models/Transaction.js";

export const getTransactions = async (req, res) => {
  const transactions = await Transaction.find();
  res.json(transactions);
};

export const getTransactionByID = async (req, res) => {
  const { id } = req.params;
  const transaction = await Transaction.findById(id);

  if (!transaction) {
    res.status(404).json({ message: "Transaction not found" });
    return;
  }

  res.json(transaction);
};

export const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  const deletedTransaction = await Transaction.findByIdAndDelete(id);

  if (!deleteTransaction) {
    res.status(404).json({ message: "Transaction not found" });
    return;
  }

  res.sendStatus(204);
};

export const postTransaction = async (req, res) => {
  const body = req.body;
  const newTransaction = await Transaction.create(body);
  res.status(201).json(newTransaction);
};

export const patchTransaction = async (req, res) => {};

export const putTransaction = async (req, res) => {};
