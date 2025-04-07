import bcrypt from 'bcrypt';
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../../config/config';

const SALT_ROUNDS = 10;

interface BaseTokenPayload {
  id: string;
  email: string;
}

interface AuthTokenPayload extends BaseTokenPayload {
  role: string;
}

interface EmailVerificationPayload extends BaseTokenPayload {
  type: 'verify_email';
}

interface PasswordResetPayload extends BaseTokenPayload {
  type: 'reset_password';
}

type TokenPayload = AuthTokenPayload | EmailVerificationPayload | PasswordResetPayload;

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateAuthToken = (payload: AuthTokenPayload): string => {
  const options: SignOptions = {
    expiresIn: '1h'
  };
  return jwt.sign(payload, config.jwtSecret, options);
};

export const generateEmailVerificationToken = (payload: Omit<EmailVerificationPayload, 'type'>): string => {
  const options: SignOptions = {
    expiresIn: '24h'
  };
  return jwt.sign({ ...payload, type: 'verify_email' }, config.jwtSecret, options);
};

export const generatePasswordResetToken = (payload: Omit<PasswordResetPayload, 'type'>): string => {
  const options: SignOptions = {
    expiresIn: '1h'
  };
  return jwt.sign({ ...payload, type: 'reset_password' }, config.jwtSecret, options);
};

export const verifyToken = <T extends TokenPayload>(token: string, expectedType?: string): T => {
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as T;
    if (expectedType && 'type' in decoded && decoded.type !== expectedType) {
      throw new Error(`Token type tidak sesuai: ${decoded.type}`);
    }
    return decoded;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Token tidak valid: ${error.message}`);
    }
    throw new Error('Token tidak valid');
  }
};

export const authenticateUser = (req: any, res: any, next: any) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token tidak ditemukan'
      });
    }

    const decoded = verifyToken<AuthTokenPayload>(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : 'Token tidak valid'
    });
  }
}; 