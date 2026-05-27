import { Transaction } from "../db/models/Transaction.js";

export const getTransactionsService = () => Transaction.find();

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
