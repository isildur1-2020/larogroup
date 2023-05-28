import * as joi from 'joi';

export const joiValidationSchema = joi.object({
  PORT: joi.number().required(),
  JWT_SECRET: joi.required(),
  ROOT_USERNAME: joi.required(),
  ROOT_PASSWORD: joi.required(),
  MONGO_DATABASE: joi.required(),
});
