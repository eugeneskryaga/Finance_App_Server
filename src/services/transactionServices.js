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
    filter.$or = [
      { note: { $regex: search.trim(), $options: "i" } },
      { category: { $regex: search.trim(), $options: "i" } },
    ];
  }

  let statistics = null;

  if (startDate && endDate && startDate !== endDate) {
    const end = new Date(endDate);
    end.setDate(end.getDate() + 1);

    const statsPipeline = [
      { $match: { date: { $gte: new Date(startDate), $lt: end } } },
      {
        $facet: {
          totals: [
            {
              $group: {
                _id: null,
                income: {
                  $sum: {
                    $cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
                  },
                },
                expenses: {
                  $sum: {
                    $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
                  },
                },
              },
            },
          ],
          categoryExpenses: [
            { $match: { type: "expense" } },
            {
              $group: {
                _id: "$category",
                total: { $sum: "$amount" },
              },
            },
          ],
        },
      },
    ];

    const [aggregateResult] = await Transaction.aggregate(statsPipeline);

    const totals = aggregateResult.totals[0] || { income: 0, expenses: 0 };
    const expensesByCategory = (aggregateResult.categoryExpenses || []).reduce(
      (acc, item) => {
        acc[item._id] = item.total;
        return acc;
      },
      {},
    );

    statistics = {
      income: totals.income,
      expenses: totals.expenses,
      balance: totals.income - totals.expenses,
      expensesByCategory,
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
    statistics,
  };
};

export const getTransactionByIdService = id => Transaction.findById(id);

export const deleteTransactionService = id => Transaction.findByIdAndDelete(id);

export const postTransactionService = data => Transaction.create(data);

export const updateTransactionService = async (id, data, options) => {
  const result = await Transaction.findByIdAndUpdate(id, data, {
    returnDocument: "after",
    includeResultMetadata: true,
    ...options,
  });

  if (!result || !result.value) {
    return null;
  }

  return {
    data: result.value,
    isUpdated: result.lastErrorObject.updatedExisting,
  };
};
