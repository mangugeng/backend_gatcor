import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../src/utils/helpers/auth.helper';

const prisma = new PrismaClient();

async function createFirstAdmin() {
  try {
    const hashedPassword = await hashPassword('password123');
    
    const admin = await prisma.admin.create({
      data: {
        email: 'admin@example.com',
        password: hashedPassword,
        name: 'Super Admin',
        role: 'super_admin'
      }
    });

    console.log('Admin berhasil dibuat:', admin);
  } catch (error) {
    console.error('Error membuat admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createFirstAdmin(); 