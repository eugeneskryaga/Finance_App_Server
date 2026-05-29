import { Joi, Segments } from "celebrate";
import { CATEGORIES, TYPES } from "../constants/index.js";
import { isValidObjectId } from "mongoose";

const validateId = (id, utils) =>
  isValidObjectId(id) ? id : utils.message("Invalid id.");

export const getTransactionsSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(3).max(20).default(3),
    sortBy: Joi.string().valid("date").default("date"),
    sortOrder: Joi.string().valid("asc", "desc").default("desc"),
    search: Joi.string(),
    startDate: Joi.date(),
    endDate: Joi.date().min(Joi.ref("startDate")),
  }),
};

export const createTransactionSchema = {
  [Segments.BODY]: Joi.object({
    type: Joi.string()
      .valid(...TYPES)
      .required(),
    category: Joi.when("type", {
      is: "income",
      then: Joi.string()
        .valid(...CATEGORIES.income)
        .required(),
      otherwise: Joi.string()
        .valid(...CATEGORIES.expenses)
        .required(),
    }),
    amount: Joi.number().positive().required(),
    note: Joi.string().min(2).max(100),
    date: Joi.date().required(),
  }),
};

export const updateTransactionSchema = {
  [Segments.BODY]: Joi.object({
    type: Joi.string().valid(...TYPES),
    category: Joi.when("type", {
      is: "income",
      then: Joi.string().valid(...CATEGORIES.income),
      otherwise: Joi.string().valid(...CATEGORIES.expenses),
    }),
    amount: Joi.number().positive(),
    note: Joi.string().min(2).max(100),
    date: Joi.date(),
  })
    .min(1)
    .with("category", "type"),
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().custom(validateId).required(),
  }),
};

export const idSchema = {
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().custom(validateId).required(),
  }),
};
