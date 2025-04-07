import { Payment } from '@prisma/client';

export const calculatePaymentFee = (amount: number, method: string): number => {
  const fees: { [key: string]: number } = {
    credit_card: 0.03, // 3%
    bank_transfer: 0.01, // 1%
    e_wallet: 0.02 // 2%
  };

  return amount * (fees[method] || 0);
};

export const calculatePaymentTax = (amount: number): number => {
  const taxRate = 0.11; // 11%
  return amount * taxRate;
};

export const calculateTotalAmount = (amount: number, method: string): number => {
  const fee = calculatePaymentFee(amount, method);
  const tax = calculatePaymentTax(amount + fee);
  return amount + fee + tax;
};

export const formatPaymentData = (payment: Payment) => {
  return {
    id: payment.id,
    orderId: payment.orderId,
    amount: payment.amount,
    method: payment.method,
    status: payment.status,
    provider: payment.provider,
    createdAt: payment.createdAt,
    updatedAt: payment.updatedAt
  };
};

export const generatePaymentReference = (payment: Payment): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `PAY-${payment.id.slice(0, 8)}-${timestamp}-${random}`;
};

export const validatePaymentMethod = (method: string): boolean => {
  const validMethods = ['credit_card', 'bank_transfer', 'e_wallet'];
  return validMethods.includes(method);
};

export const validatePaymentProvider = (provider: string): boolean => {
  const validProviders = ['midtrans', 'xendit'];
  return validProviders.includes(provider);
};

export const validatePaymentStatus = (status: string): boolean => {
  const validStatuses = ['pending', 'processing', 'completed', 'failed', 'refunded'];
  return validStatuses.includes(status);
};

export const getPaymentStatusMessage = (status: string): string => {
  const messages: { [key: string]: string } = {
    pending: 'Pembayaran menunggu diproses',
    processing: 'Pembayaran sedang diproses',
    completed: 'Pembayaran berhasil',
    failed: 'Pembayaran gagal',
    refunded: 'Pembayaran telah direfund'
  };

  return messages[status] || 'Status pembayaran tidak valid';
}; 