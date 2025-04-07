import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { AdminRole } from '../models/user/admin.model';

interface CustomRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticateUser = (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token tidak ditemukan'
      });
    }

    const decoded = jwt.verify(token, config.jwtSecret) as {
      id: string;
      email: string;
      role: string;
    };

    console.log('Decoded token:', decoded); // Debug log

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    next();
  } catch (error) {
    console.error('Error verifying token:', error); // Debug log
    return res.status(401).json({
      success: false,
      message: 'Token tidak valid'
    });
  }
};

export const requireAdmin = (req: CustomRequest, res: Response, next: NextFunction) => {
  if (!req.user || !Object.values(AdminRole).includes(req.user.role as AdminRole)) {
    return res.status(403).json({
      success: false,
      message: 'Anda tidak memiliki akses untuk melakukan aksi ini'
    });
  }
  next();
};

export const requireSuperAdmin = (req: CustomRequest, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'SUPER_ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Anda tidak memiliki akses untuk melakukan aksi ini'
    });
  }
  next();
};

export const requireCustomerService = (req: CustomRequest, res: Response, next: NextFunction) => {
  if (!req.user || (req.user.role !== 'SUPER_ADMIN' && req.user.role !== 'CUSTOMER_SERVICE')) {
    return res.status(403).json({
      success: false,
      message: 'Anda tidak memiliki akses untuk melakukan aksi ini'
    });
  }
  next();
}; 