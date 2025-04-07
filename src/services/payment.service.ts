import { PrismaClient } from '@prisma/client';
import { MidtransService } from './midtrans.service';
import { XenditService } from './xendit.service';

const prisma = new PrismaClient();

export class PaymentService {
  private midtransService: MidtransService;
  private xenditService: XenditService;

  constructor() {
    this.midtransService = new MidtransService();
    this.xenditService = new XenditService();
  }

  async createPayment(data: {
    orderId: string;
    amount: number;
    method: string;
    provider: string;
  }) {
    const order = await prisma.order.findUnique({
      where: { id: data.orderId }
    });

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.paymentStatus !== 'pending') {
      throw new Error('Order already has payment');
    }

    const payment = await prisma.payment.create({
      data: {
        orderId: data.orderId,
        amount: data.amount,
        method: data.method,
        provider: data.provider,
        status: 'pending'
      }
    });

    return payment;
  }

  async processPayment(paymentId: string, paymentData: any) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { order: true }
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.status !== 'pending') {
      throw new Error('Payment already processed');
    }

    let result;
    if (payment.provider === 'midtrans') {
      result = await this.midtransService.processPayment(payment, paymentData);
    } else if (payment.provider === 'xendit') {
      result = await this.xenditService.processPayment(payment, paymentData);
    } else {
      throw new Error('Invalid payment provider');
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: result.status,
        providerRef: result.providerRef,
        metadata: result.metadata
      }
    });

    if (result.status === 'completed') {
      await prisma.order.update({
        where: { id: payment.orderId },
        data: { paymentStatus: 'paid' }
      });
    }

    return updatedPayment;
  }

  async refundPayment(paymentId: string, amount: number, reason: string) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { order: true }
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    if (payment.status !== 'completed') {
      throw new Error('Payment not completed');
    }

    if (amount > payment.amount) {
      throw new Error('Refund amount exceeds payment amount');
    }

    let result;
    if (payment.provider === 'midtrans') {
      result = await this.midtransService.refundPayment(payment, amount);
    } else if (payment.provider === 'xendit') {
      result = await this.xenditService.refundPayment(payment, amount);
    } else {
      throw new Error('Invalid payment provider');
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'refunded',
        refundAmount: amount,
        refundReason: reason,
        metadata: {
          ...payment.metadata,
          refund: result
        }
      }
    });

    await prisma.order.update({
      where: { id: payment.orderId },
      data: { paymentStatus: 'refunded' }
    });

    return updatedPayment;
  }

  async getPaymentHistory(userId: string, filters: {
    startDate?: Date;
    endDate?: Date;
    status?: string;
    method?: string;
  }) {
    const where: any = {
      order: {
        OR: [
          { customerId: userId },
          { driverId: userId }
        ]
      }
    };

    if (filters.startDate && filters.endDate) {
      where.createdAt = {
        gte: filters.startDate,
        lte: filters.endDate
      };
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.method) {
      where.method = filters.method;
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        order: {
          select: {
            id: true,
            status: true,
            fare: true,
            customer: {
              select: {
                id: true,
                name: true
              }
            },
            driver: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return payments;
  }

  async checkPaymentStatus(paymentId: string) {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { order: true }
    });

    if (!payment) {
      throw new Error('Payment not found');
    }

    let status;
    if (payment.provider === 'midtrans') {
      status = await this.midtransService.checkPaymentStatus(payment);
    } else if (payment.provider === 'xendit') {
      status = await this.xenditService.checkPaymentStatus(payment);
    } else {
      throw new Error('Invalid payment provider');
    }

    return {
      paymentId: payment.id,
      orderId: payment.orderId,
      amount: payment.amount,
      method: payment.method,
      provider: payment.provider,
      status: status.transaction_status,
      metadata: status
    };
  }
} 