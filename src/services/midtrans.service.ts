import { Payment } from '@prisma/client';
import midtransClient from 'midtrans-client';
import { midtransConfig } from '../config/midtrans.config';
import axios from 'axios';

interface Payment {
  id: string;
  method: string;
  providerRef?: string;
  amount: number;
  status: string;
}

export class MidtransService {
  private snap: any;
  private core: any;
  private baseUrl: string;
  private auth: string;

  constructor() {
    this.snap = new midtransClient.Snap({
      isProduction: midtransConfig.isProduction,
      serverKey: midtransConfig.serverKey,
      clientKey: midtransConfig.clientKey
    });

    this.core = new midtransClient.CoreApi({
      isProduction: midtransConfig.isProduction,
      serverKey: midtransConfig.serverKey,
      clientKey: midtransConfig.clientKey
    });

    this.baseUrl = midtransConfig.isProduction
      ? 'https://api.midtrans.com'
      : 'https://api.sandbox.midtrans.com';
    
    this.auth = Buffer.from(midtransConfig.serverKey + ':').toString('base64');
  }

  async processPayment(payment: Payment, paymentData: any) {
    try {
      const parameter = {
        payment_type: payment.method === 'credit_card' ? 'credit_card' : 'bank_transfer',
        transaction_details: {
          order_id: payment.id,
          gross_amount: payment.amount
        },
        credit_card: {
          secure: true
        },
        customer_details: {
          first_name: paymentData.customerName,
          email: paymentData.customerEmail,
          phone: paymentData.customerPhone
        }
      };

      console.log('Midtrans payment parameter:', parameter);

      let transaction;
      if (payment.method === 'credit_card') {
        // Create transaction using Snap
        const snapTransaction = await this.snap.createTransaction(parameter);
        
        // Get transaction details using Core API
        const coreTransaction = await this.core.transaction.status(snapTransaction.token);
        
        return {
          status: 'processing',
          providerRef: coreTransaction.transaction_id,
          metadata: {
            token: snapTransaction.token,
            redirect_url: snapTransaction.redirect_url,
            transaction_id: coreTransaction.transaction_id,
            order_id: payment.id
          }
        };
      } else {
        transaction = await this.core.charge(parameter);
        return {
          status: 'processing',
          providerRef: transaction.transaction_id,
          metadata: {
            transaction_id: transaction.transaction_id,
            payment_type: transaction.payment_type,
            status_code: transaction.status_code,
            status_message: transaction.status_message,
            order_id: payment.id
          }
        };
      }
    } catch (error) {
      console.error('Midtrans payment error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data
      });
      throw new Error('Failed to process payment with Midtrans');
    }
  }

  async refundPayment(payment: Payment, amount: number) {
    try {
      const refund = await this.core.refund(payment.providerRef!, {
        refund_key: `refund-${payment.id}-${Date.now()}`,
        amount: amount,
        reason: 'Customer request'
      });

      return {
        status: 'refunded',
        providerRef: refund.refund_key,
        metadata: {
          refund: refund
        }
      };
    } catch (error) {
      console.error('Midtrans refund error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data
      });
      throw new Error('Failed to process refund with Midtrans');
    }
  }

  async checkPaymentStatus(payment: Payment) {
    try {
      if (!payment.providerRef) {
        console.error('Payment provider reference not found:', payment);
        throw new Error('Provider reference not found');
      }

      console.log('Checking Midtrans payment status for:', payment.providerRef);

      // Always use Core API to check transaction status
      const status = await this.core.transaction.status(payment.providerRef);

      console.log('Midtrans status response:', status);

      return {
        transaction_status: status.transaction_status || 'unknown',
        payment_type: status.payment_type || payment.method,
        transaction_id: status.transaction_id || payment.providerRef,
        order_id: status.order_id || payment.id,
        gross_amount: status.gross_amount?.toString() || payment.amount.toString()
      };
    } catch (error) {
      console.error('Midtrans status check error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data
      });
      throw new Error('Failed to check payment status with Midtrans');
    }
  }
} 