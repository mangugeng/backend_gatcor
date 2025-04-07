import Joi from 'joi';

export const driverStatusSchema = Joi.object({
  status: Joi.string().valid('available', 'busy', 'offline').required()
});

export const driverLocationSchema = Joi.object({
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required()
});

export const driverUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(50),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/^[0-9]{10,13}$/),
  vehicleType: Joi.string().valid('motorcycle', 'car'),
  licenseNumber: Joi.string().min(5).max(20),
  licensePlate: Joi.string().min(5).max(10),
  status: Joi.string().valid('available', 'busy', 'offline')
});

export const validateDriverUpdate = (data: any) => {
  return driverUpdateSchema.validate(data);
}; 