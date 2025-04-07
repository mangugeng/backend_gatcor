import Joi from 'joi';

export const validateCustomerUpdate = (data: any) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50),
    email: Joi.string().email(),
    password: Joi.string().min(6)
  });

  return schema.validate(data);
}; 