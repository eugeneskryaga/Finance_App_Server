import { Transaction } from "../db/models/Transaction.js";

export const getTransactionsService = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  category,
}) => {
  const skip = (page - 1) * perPage;

  const transactionsQuery = Transaction.find();

  if (category) {
    transactionsQuery.where("category").equals(category);
  }

  const [totalTransactions, transactions] = await Promise.all([
    transactionsQuery.clone().countDocuments(),
    transactionsQuery
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder }),
  ]);

  const totalPages = Math.ceil(totalTransactions / perPage);
  const isNextPageExists = page !== totalPages;

  return { transactions, totalTransactions, totalPages, isNextPageExists };
};

export const getTransactionsByIdService = id => Transaction.findById(id);

export const deleteTransactionsService = id =>
  Transaction.findByIdAndDelete(id);

export const postTransactionsService = data => Transaction.create(data);

export const updateTransactionsService = async (id, data, options) => {
  const result = await Transaction.findByIdAndUpdate(id, data, {
    returnDocument: "after",
    includeResultMetadata: true,
    ...options,
  });

  if (!result.value) {
    return null;
  }

  return {
    data: result.value,
    isUpdated: result.lastErrorObject.updatedExisting,
  };
};
