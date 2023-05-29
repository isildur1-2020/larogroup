import * as joi from 'joi';

export const joiValidationSchema = joi.object({
  STAGE: joi.required(),
  JWT_SECRET: joi.required(),
  ROOT_USERNAME: joi.required(),
  PORT: joi.number().required(),
  ROOT_PASSWORD: joi.required(),
  MONGO_DATABASE: joi.required(),
});
