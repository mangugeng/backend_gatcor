import Joi from 'joi';

export const createPaymentSchema = Joi.object({
  orderId: Joi.string().uuid().required(),
  amount: Joi.number().positive().required(),
  method: Joi.string().valid('credit_card', 'bank_transfer', 'e_wallet').required(),
  provider: Joi.string().valid('midtrans', 'xendit').required()
});

export const processPaymentSchema = Joi.object({
  paymentId: Joi.string().uuid().required(),
  paymentData: Joi.object().required()
});

export const refundPaymentSchema = Joi.object({
  paymentId: Joi.string().uuid().required(),
  amount: Joi.number().positive().required(),
  reason: Joi.string().min(10).max(500).required()
}); 