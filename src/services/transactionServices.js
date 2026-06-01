import { Transaction } from "../db/models/Transaction.js";

export const getTransactionsService = async ({
  page,
  perPage,
  sortBy,
  sortOrder,
  search,
  startDate,
  endDate,
}) => {
  const skip = (page - 1) * perPage;
  const filter = {};

  if (startDate || endDate) {
    filter.date = {};

    if (startDate) {
      filter.date.$gte = new Date(startDate);
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1);
      filter.date.$lt = end;
    }
  }

  if (search?.trim()) {
    filter.$text = {
      $search: search.trim(),
    };
  }

  const transactionsQuery = Transaction.find(filter);

  const [totalTransactions, transactions] = await Promise.all([
    transactionsQuery.clone().countDocuments(),
    transactionsQuery
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 }),
  ]);

  const totalPages = Math.ceil(totalTransactions / perPage);
  const isNextPageExists = page < totalPages;

  return {
    transactions,
    totalTransactions,
    totalPages,
    currentPage: page,
    isNextPageExists,
  };
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
