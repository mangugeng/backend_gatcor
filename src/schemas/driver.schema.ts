import { z } from 'zod';

export const createDriverSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter'),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
  phone: z.string().min(10, 'Nomor telepon minimal 10 digit'),
  vehicleType: z.enum(['motorcycle', 'car'], {
    required_error: 'Tipe kendaraan harus dipilih',
  }),
  licenseNumber: z.string().min(5, 'Nomor lisensi minimal 5 karakter'),
  licensePlate: z.string().min(5, 'Nomor plat minimal 5 karakter'),
});

export const updateDriverSchema = z.object({
  name: z.string().min(3, 'Nama minimal 3 karakter').optional(),
  email: z.string().email('Email tidak valid').optional(),
  phone: z.string().min(10, 'Nomor telepon minimal 10 digit').optional(),
  vehicleType: z.enum(['motorcycle', 'car'], {
    required_error: 'Tipe kendaraan harus dipilih',
  }).optional(),
  licenseNumber: z.string().min(5, 'Nomor lisensi minimal 5 karakter').optional(),
  licensePlate: z.string().min(5, 'Nomor plat minimal 5 karakter').optional(),
  status: z.enum(['available', 'busy', 'offline'], {
    required_error: 'Status harus dipilih',
  }).optional(),
});

export const updateDriverLocationSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export type CreateDriverInput = z.infer<typeof createDriverSchema>;
export type UpdateDriverInput = z.infer<typeof updateDriverSchema>;
export type UpdateDriverLocationInput = z.infer<typeof updateDriverLocationSchema>; 