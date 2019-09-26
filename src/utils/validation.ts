import Joi from '@hapi/joi';

export function registerValidation(data: any) {
  const schema = {
    name: Joi.string()
      .min(6)
      .required(),
    email: Joi.string()
      .min(6)
      .required(),
    password: Joi.string()
      .min(6)
      .required()
  };
  return Joi.validate(data, schema);
}

export function loginValidation(data: any) {
  const schema = {
    email: Joi.string()
      .min(6)
      .required(),
    password: Joi.string()
      .min(6)
      .required()
  };
  return Joi.validate(data, schema);
}
