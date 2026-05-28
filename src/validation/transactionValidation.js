import { Joi, Segments } from "celebrate";
import { CATEGORIES, TYPES } from "../constants/index.js";
import { isValidObjectId } from "mongoose";

const validateId = (id, utils) =>
  isValidObjectId(id) ? id : utils.message("Invalid id.");

export const getTransactionsSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1),
    perPage: Joi.number().integer().min(3).max(20),
  }),
};

export const createTransactionSchema = {
  [Segments.BODY]: Joi.object({
    type: Joi.string()
      .valid(...TYPES)
      .required(),
    category: Joi.string()
      .valid(...CATEGORIES)
      .required(),
    amount: Joi.number().min(1).required(),
    note: Joi.string().min(2).max(100),
  }),
};

export const updateTransactionSchema = {
  [Segments.BODY]: Joi.object({
    type: Joi.string().valid(...TYPES),
    category: Joi.string().valid(...CATEGORIES),
    amount: Joi.number().min(1),
    note: Joi.string().min(2).max(100),
  }).min(1),
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().custom(validateId).required(),
  }),
};

export const idSchema = {
  [Segments.PARAMS]: Joi.object({
    id: Joi.string().custom(validateId).required(),
  }),
};
