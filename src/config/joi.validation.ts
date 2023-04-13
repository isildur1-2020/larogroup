import * as joi from 'joi';

export const joiValidationSchema = joi.object({
  PORT: joi.number().required(),
  MONGODB_URI: joi.required(),
  JWT_SECRET: joi.required(),
  ROOT_PASSWORD: joi.required(),
});
