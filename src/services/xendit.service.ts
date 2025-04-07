import { Payment } from '@prisma/client';
import Xendit from 'xendit-node';

export class XenditService {
  private x: any;

  constructor() {
    this.x = new Xendit({
      secretKey: process.env.XENDIT_SECRET_KEY
    });
  }

  async processPayment(payment: Payment, paymentData: any) {
    try {
      const { Invoice } = this.x;
      const invoiceSpecificOptions = {};
      const i = new Invoice(invoiceSpecificOptions);

      const invoice = await i.createInvoice({
        externalId: payment.id,
        amount: payment.amount,
        description: `Payment for order ${payment.orderId}`,
        invoiceDuration: 86400,
        customer: {
          given_names: paymentData.customerName,
          email: paymentData.customerEmail,
          mobile_number: paymentData.customerPhone
        },
        successRedirectUrl: `${process.env.APP_URL}/payment/success`,
        failureRedirectUrl: `${process.env.APP_URL}/payment/failed`
      });

      return {
        status: 'processing',
        providerRef: invoice.id,
        metadata: {
          invoice_url: invoice.invoice_url,
          expiry_date: invoice.expiry_date
        }
      };
    } catch (error) {
      console.error('Xendit payment error:', error);
      throw new Error('Failed to process payment with Xendit');
    }
  }

  async refundPayment(payment: Payment, amount: number) {
    try {
      const { Invoice } = this.x;
      const invoiceSpecificOptions = {};
      const i = new Invoice(invoiceSpecificOptions);

      const refund = await i.createRefund({
        invoiceId: payment.providerRef!,
        amount: amount,
        reason: 'Customer request'
      });

      return {
        status: 'refunded',
        providerRef: refund.id,
        metadata: {
          refund: refund
        }
      };
    } catch (error) {
      console.error('Xendit refund error:', error);
      throw new Error('Failed to process refund with Xendit');
    }
  }

  async checkPaymentStatus(payment: Payment) {
    try {
      const { Invoice } = this.x;
      const invoiceSpecificOptions = {};
      const i = new Invoice(invoiceSpecificOptions);

      const invoice = await i.getInvoice({
        invoiceId: payment.providerRef!
      });

      return invoice;
    } catch (error) {
      console.error('Xendit status check error:', error);
      throw new Error('Failed to check payment status with Xendit');
    }
  }
} 