import Joi from 'joi';

export const createOrderSchema = Joi.object({
  pickupAddress: Joi.string().required(),
  dropoffAddress: Joi.string().required(),
  pickupLat: Joi.number().required(),
  pickupLng: Joi.number().required(),
  dropoffLat: Joi.number().required(),
  dropoffLng: Joi.number().required(),
  distance: Joi.number().required(),
  fare: Joi.number().required()
});

export const updateOrderSchema = Joi.object({
  status: Joi.string().valid('pending', 'accepted', 'in_progress', 'completed', 'cancelled'),
  paymentStatus: Joi.string().valid('pending', 'paid', 'refunded'),
  driverId: Joi.string().uuid()
});

export const rateOrderSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required(),
  review: Joi.string().min(10).max(500)
}); 