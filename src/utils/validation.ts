import Joi from "@hapi/joi";

export function registerValidation(data: any) {
  const schema = {
    name: Joi.string()
      .min(6)
      .required(),
    identification: Joi.string()
      .min(6)
      .required(),
    email: Joi.string()
      .min(6)
      .required(),
    type: Joi.string()
      .required(),
    password: Joi.string()
      .min(6)
      .required()
  };
  return Joi.validate(data, schema);
}

export function loginValidation(data: any) {
  const schema = {
    identification: Joi.string()
      .min(6)
      .required(),
    password: Joi.string()
      .min(6)
      .required()
  };
  return Joi.validate(data, schema);
}

export function serviceValidation(data: any) {
  const schema = {
    name: Joi.string()
      .min(6)
      .required(),
    description: Joi.string().min(2),
    participants: Joi.array().required(),
    assets: Joi.array().required()
  };
  return Joi.validate(data, schema);
}
