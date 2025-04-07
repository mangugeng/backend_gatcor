import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  CUSTOMER_SERVICE = 'CUSTOMER_SERVICE',
  ADMIN_TECHNICAL = 'ADMIN_TECHNICAL',
  FINANCE = 'FINANCE'
}

export interface Admin {
  id: string;
  email: string;
  password: string;
  name: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const createAdmin = async (data: Omit<Admin, 'id' | 'createdAt' | 'updatedAt'>) => {
  return prisma.admin.create({
    data: {
      ...data,
      isActive: data.isActive ?? true
    }
  });
};

export const getAdminById = async (id: string) => {
  return prisma.admin.findUnique({
    where: { id }
  });
};

export const getAdminByEmail = async (email: string) => {
  return prisma.admin.findUnique({
    where: { email }
  });
};

export const updateAdmin = async (id: string, data: Partial<Admin>) => {
  return prisma.admin.update({
    where: { id },
    data
  });
};

export const deleteAdmin = async (id: string) => {
  return prisma.admin.delete({
    where: { id }
  });
};

export const getAdminsByRole = async (role: AdminRole) => {
  return prisma.admin.findMany({
    where: { role }
  });
}; 