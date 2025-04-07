import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AdminRole } from '../models/user/admin.model';

export const validateFinanceTransaction = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    type: Joi.string().valid('income', 'expense').required(),
    amount: Joi.number().positive().required(),
    description: Joi.string().required(),
    category: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }

  next();
};

export const validateFinanceReport = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    type: Joi.string().valid('daily', 'weekly', 'monthly', 'yearly').required(),
    startDate: Joi.date().iso().required(),
    endDate: Joi.date().iso().min(Joi.ref('startDate')).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }

  next();
};

export const validateCustomerServiceTicket = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    subject: Joi.string().required(),
    message: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }

  next();
};

export const validateCustomerServiceReply = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    message: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }

  next();
};

export const validateAdmin = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().required(),
    role: Joi.string().valid(...Object.values(AdminRole)).required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }

  next();
}; 