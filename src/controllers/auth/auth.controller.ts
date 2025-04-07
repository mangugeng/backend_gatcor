import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { 
  hashPassword, 
  comparePassword, 
  generateAuthToken,
  generateEmailVerificationToken,
  generatePasswordResetToken,
  verifyToken 
} from '../../utils/helpers/auth.helper';
import { sendEmail } from '../../services/email/email.service';
import { TokenPayload } from '../../utils/interfaces/auth.interface';
import Joi from 'joi';
import { generateToken } from '../../utils/helpers/jwt.helper';

interface AuthTokenPayload {
  id: string;
  email: string;
  role: string;
}

interface EmailVerificationPayload {
  id: string;
  email: string;
  type: 'verify_email';
}

const prisma = new PrismaClient();

// Validation Schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const emailSchema = Joi.object({
  email: Joi.string().email().required()
});

const passwordSchema = Joi.object({
  password: Joi.string().min(6).required()
});

const tokenSchema = Joi.object({
  token: Joi.string().required()
});

// Customer Auth Controllers
export const registerCustomer = async (req: Request, res: Response) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { email, password, name } = req.body;

    // Cek apakah email sudah terdaftar
    const existingCustomer = await prisma.user.findUnique({
      where: { email }
    });

    if (existingCustomer) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar'
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Simpan data customer
    const customer = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'customer'
      }
    });

    // Generate token
    const token = generateAuthToken({
      id: customer.id,
      email: customer.email,
      role: 'customer'
    });

    // Generate verification token dan kirim email verifikasi
    const verificationToken = generateEmailVerificationToken({
      id: customer.id,
      email: customer.email
    });

    // Kirim email verifikasi
    await sendEmail({
      to: email,
      subject: 'Verifikasi Email',
      text: `Token verifikasi email Anda: ${verificationToken}`
    });

    return res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      data: {
        token,
        customer: {
          id: customer.id,
          email: customer.email,
          name: customer.name
        }
      }
    });
  } catch (error) {
    console.error('Error registering customer:', error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Terjadi kesalahan server'
    });
  }
};

export const loginCustomer = async (req: Request, res: Response) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { email, password } = req.body;

    // Cek apakah customer ada
    const customer = await prisma.user.findUnique({
      where: { email }
    });

    if (!customer || customer.role !== 'customer') {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    // Verifikasi password
    const isPasswordValid = await comparePassword(password, customer.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    // Generate token
    const token = generateAuthToken({
      id: customer.id,
      email: customer.email,
      role: 'customer'
    });

    return res.status(200).json({
      success: true,
      message: 'Login berhasil',
      data: {
        token,
        customer: {
          id: customer.id,
          email: customer.email,
          name: customer.name
        }
      }
    });
  } catch (error) {
    console.error('Error logging in customer:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const verifyCustomerEmail = async (req: Request, res: Response) => {
  try {
    const { error } = tokenSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { token } = req.body;

    // Verifikasi token dengan tipe 'verify_email'
    const decoded = verifyToken<EmailVerificationPayload>(token, 'verify_email');

    // Update status verifikasi email
    await prisma.user.update({
      where: { id: decoded.id },
      data: { emailVerified: true }
    });

    return res.status(200).json({
      success: true,
      message: 'Email berhasil diverifikasi'
    });
  } catch (error) {
    console.error('Error verifying customer email:', error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Terjadi kesalahan server'
    });
  }
};

export const forgotCustomerPassword = async (req: Request, res: Response) => {
  try {
    const { error } = emailSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { email } = req.body;

    // Cek apakah customer ada
    const customer = await prisma.user.findUnique({
      where: { email }
    });

    if (!customer || customer.role !== 'customer') {
      return res.status(404).json({
        success: false,
        message: 'Email tidak ditemukan'
      });
    }

    // Generate token reset password
    const resetToken = generatePasswordResetToken({
      id: customer.id,
      email: customer.email
    });

    // Kirim email reset password
    await sendEmail({
      to: email,
      subject: 'Reset Password',
      text: `Token reset password Anda: ${resetToken}`
    });

    return res.status(200).json({
      success: true,
      message: 'Email reset password telah dikirim'
    });
  } catch (error) {
    console.error('Error sending reset password email:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const resetCustomerPassword = async (req: Request, res: Response) => {
  try {
    const { error } = Joi.object({
      token: Joi.string().required(),
      password: Joi.string().min(6).required()
    }).validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { token, password } = req.body;

    // Verifikasi token
    const decoded = verifyToken(token, 'reset_password');

    // Hash password baru
    const hashedPassword = await hashPassword(password);

    // Update password
    await prisma.user.update({
      where: { id: decoded.id },
      data: { password: hashedPassword }
    });

    return res.status(200).json({
      success: true,
      message: 'Password berhasil direset'
    });
  } catch (error) {
    console.error('Error resetting customer password:', error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Terjadi kesalahan server'
    });
  }
};

export const refreshCustomerToken = async (req: Request, res: Response) => {
  try {
    const { error } = tokenSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { token } = req.body;

    // Verifikasi token
    const decoded = verifyToken<AuthTokenPayload>(token);

    if (decoded.role !== 'customer') {
      return res.status(400).json({
        success: false,
        message: 'Token tidak valid'
      });
    }

    // Generate token baru
    const newToken = generateAuthToken({
      id: decoded.id,
      email: decoded.email,
      role: 'customer'
    });

    return res.status(200).json({
      success: true,
      message: 'Token berhasil diperbarui',
      data: { token: newToken }
    });
  } catch (error) {
    console.error('Error refreshing customer token:', error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Terjadi kesalahan server'
    });
  }
};

export const logoutCustomer = async (req: Request, res: Response) => {
  try {
    // Hapus token dari client-side
    return res.status(200).json({
      success: true,
      message: 'Logout berhasil'
    });
  } catch (error) {
    console.error('Error logging out customer:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

// Driver Auth Controllers
export const registerDriver = async (req: Request, res: Response) => {
  try {
    const { error } = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
      name: Joi.string().required(),
      vehicleType: Joi.string().required(),
      licenseNumber: Joi.string().required()
    }).validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { email, password, name, vehicleType, licenseNumber } = req.body;

    // Cek apakah email sudah terdaftar
    const existingDriver = await prisma.user.findUnique({
      where: { email }
    });

    if (existingDriver) {
      return res.status(400).json({
        success: false,
        message: 'Email sudah terdaftar'
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Simpan data driver
    const driver = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'driver',
        vehicleType,
        licenseNumber
      }
    });

    // Generate token
    const token = generateAuthToken({
      id: driver.id,
      email: driver.email,
      role: 'driver'
    });

    return res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      data: {
        token,
        driver: {
          id: driver.id,
          email: driver.email,
          name: driver.name,
          vehicleType: driver.vehicleType,
          licenseNumber: driver.licenseNumber
        }
      }
    });
  } catch (error) {
    console.error('Error registering driver:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const loginDriver = async (req: Request, res: Response) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { email, password } = req.body;

    // Cek apakah driver ada
    const driver = await prisma.user.findUnique({
      where: { email }
    });

    if (!driver || driver.role !== 'driver') {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    // Verifikasi password
    const isPasswordValid = await comparePassword(password, driver.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    // Generate token
    const token = generateAuthToken({
      id: driver.id,
      email: driver.email,
      role: 'driver'
    });

    return res.status(200).json({
      success: true,
      message: 'Login berhasil',
      data: {
        token,
        driver: {
          id: driver.id,
          email: driver.email,
          name: driver.name,
          vehicleType: driver.vehicleType,
          licenseNumber: driver.licenseNumber
        }
      }
    });
  } catch (error) {
    console.error('Error logging in driver:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const verifyDriverEmail = async (req: Request, res: Response) => {
  try {
    const { error } = tokenSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { token } = req.body;

    // Verifikasi token
    const decoded = verifyToken(token);

    // Update status verifikasi email
    await prisma.user.update({
      where: { id: decoded.id },
      data: { emailVerified: true }
    });

    return res.status(200).json({
      success: true,
      message: 'Email berhasil diverifikasi'
    });
  } catch (error) {
    console.error('Error verifying driver email:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const forgotDriverPassword = async (req: Request, res: Response) => {
  try {
    const { error } = emailSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { email } = req.body;

    // Cek apakah driver ada
    const driver = await prisma.user.findUnique({
      where: { email }
    });

    if (!driver || driver.role !== 'driver') {
      return res.status(404).json({
        success: false,
        message: 'Email tidak ditemukan'
      });
    }

    // Generate token reset password
    const resetToken = generatePasswordResetToken({
      id: driver.id,
      email: driver.email
    });

    // Kirim email reset password
    await sendEmail({
      to: email,
      subject: 'Reset Password',
      text: `Token reset password Anda: ${resetToken}`
    });

    return res.status(200).json({
      success: true,
      message: 'Email reset password telah dikirim'
    });
  } catch (error) {
    console.error('Error sending reset password email:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const resetDriverPassword = async (req: Request, res: Response) => {
  try {
    const { error } = Joi.object({
      token: Joi.string().required(),
      password: Joi.string().min(6).required()
    }).validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { token, password } = req.body;

    // Verifikasi token
    const decoded = verifyToken(token);

    if (decoded.type !== 'reset_password') {
      return res.status(400).json({
        success: false,
        message: 'Token tidak valid'
      });
    }

    // Hash password baru
    const hashedPassword = await hashPassword(password);

    // Update password
    await prisma.user.update({
      where: { id: decoded.id },
      data: { password: hashedPassword }
    });

    return res.status(200).json({
      success: true,
      message: 'Password berhasil direset'
    });
  } catch (error) {
    console.error('Error resetting driver password:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const refreshDriverToken = async (req: Request, res: Response) => {
  try {
    const { error } = tokenSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { token } = req.body;

    // Verifikasi token
    const decoded = verifyToken(token);

    if (decoded.role !== 'driver') {
      return res.status(400).json({
        success: false,
        message: 'Token tidak valid'
      });
    }

    // Generate token baru
    const newToken = generateAuthToken({
      id: decoded.id,
      email: decoded.email,
      role: 'driver'
    });

    return res.status(200).json({
      success: true,
      message: 'Token berhasil diperbarui',
      data: { token: newToken }
    });
  } catch (error) {
    console.error('Error refreshing driver token:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const logoutDriver = async (req: Request, res: Response) => {
  try {
    // Hapus token dari client-side
    return res.status(200).json({
      success: true,
      message: 'Logout berhasil'
    });
  } catch (error) {
    console.error('Error logging out driver:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

// Admin Auth Controllers
export const loginAdmin = async (req: Request, res: Response) => {
  try {
    // Validasi input
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { email, password } = req.body;

    // Cek apakah admin ada
    const admin = await prisma.admin.findUnique({
      where: { email }
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    // Verifikasi password
    const isPasswordValid = await comparePassword(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Email atau password salah'
      });
    }

    // Cek apakah admin aktif
    if (!admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Akun admin tidak aktif'
      });
    }

    // Generate token
    const token = generateToken({
      id: admin.id,
      email: admin.email,
      role: admin.role
    });

    return res.json({
      success: true,
      message: 'Login berhasil',
      data: {
        token,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role
        }
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const forgotAdminPassword = async (req: Request, res: Response) => {
  try {
    const { error } = emailSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { email } = req.body;

    // Cek apakah admin ada
    const admin = await prisma.admin.findUnique({
      where: { email }
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Email tidak ditemukan'
      });
    }

    // Generate token reset password
    const resetToken = generatePasswordResetToken({
      id: admin.id,
      email: admin.email
    });

    // Kirim email reset password
    await sendEmail({
      to: email,
      subject: 'Reset Password',
      text: `Token reset password Anda: ${resetToken}`
    });

    return res.status(200).json({
      success: true,
      message: 'Email reset password telah dikirim'
    });
  } catch (error) {
    console.error('Error sending reset password email:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const resetAdminPassword = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;

    // Validasi input
    const { error } = Joi.object({
      email: Joi.string().email().required(),
      newPassword: Joi.string().min(6).required()
    }).validate({ email, newPassword });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    // Cari admin
    const admin = await prisma.admin.findUnique({
      where: { email }
    });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin tidak ditemukan'
      });
    }

    // Hash password baru
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await prisma.admin.update({
      where: { id: admin.id },
      data: { password: hashedPassword }
    });

    return res.json({
      success: true,
      message: 'Password berhasil direset'
    });
  } catch (error) {
    console.error('Error resetting admin password:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat mereset password'
    });
  }
};

export const refreshAdminToken = async (req: Request, res: Response) => {
  try {
    const { error } = tokenSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { token } = req.body;

    // Verifikasi token
    const decoded = verifyToken(token);

    if (!decoded.role.includes('admin')) {
      return res.status(400).json({
        success: false,
        message: 'Token tidak valid'
      });
    }

    // Generate token baru
    const newToken = generateAuthToken({
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    });

    return res.status(200).json({
      success: true,
      message: 'Token berhasil diperbarui',
      data: { token: newToken }
    });
  } catch (error) {
    console.error('Error refreshing admin token:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

export const logoutAdmin = async (req: Request, res: Response) => {
  try {
    // Hapus token dari client-side
    return res.status(200).json({
      success: true,
      message: 'Logout berhasil'
    });
  } catch (error) {
    console.error('Error logging out admin:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
};

// Buat admin pertama
export const createFirstAdmin = async (req: Request, res: Response) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { email, password, name } = req.body;

    // Cek apakah sudah ada admin
    const existingAdmin = await prisma.admin.findFirst();
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin sudah ada'
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Buat admin pertama
    const admin = await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'SUPER_ADMIN',
        isActive: true
      }
    });

    // Generate token
    const token = generateToken({
      id: admin.id,
      email: admin.email,
      role: admin.role
    });

    return res.status(201).json({
      success: true,
      message: 'Admin berhasil dibuat',
      data: {
        token,
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role
        }
      }
    });
  } catch (error) {
    console.error('Error creating first admin:', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan server'
    });
  }
}; 