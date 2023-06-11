import * as joi from 'joi';

export const joiValidationSchema = joi.object({
  JWT_SECRET: joi.required(),
  MONGO_HOST: joi.required(),
  ROOT_USERNAME: joi.required(),
  PORT: joi.number().required(),
  ROOT_PASSWORD: joi.required(),
  MONGO_DATABASE: joi.required(),
});
