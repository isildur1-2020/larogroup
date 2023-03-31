import * as joi from 'joi';

export const joiValidationSchema = joi.object({
  PORT: joi.number().default('8080'),
  MONGODB_URI: joi.required(),
  JWT_SECRET: joi.required(),
});
