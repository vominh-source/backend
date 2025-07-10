import Joi from 'joi';

export const createUserSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  birthdate: Joi.string().isoDate().required(),
});

export const updateUserSchema = Joi.object({
  id: Joi.number().integer().positive().required(),
  username: Joi.string().min(3).max(50).optional(),
  email: Joi.string().email().optional(),
  birthdate: Joi.string().isoDate().optional(),
}).min(2); // At least id and one other field

export const updateUsersArraySchema = Joi.array().items(updateUserSchema).min(1).required();

export const searchQuerySchema = Joi.object({
  name: Joi.string().min(1).optional(),
});
