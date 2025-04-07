interface Payment {
  id: string;
  provider: string;
  status: string;
  amount: number;
  currency: string;
  reference: string;
  metadata: any;
  createdAt: Date;
  updatedAt: Date;
}

export const getPaymentGatewayConfig = (provider: string) => {
  const configs: { [key: string]: any } = {
    midtrans: {
      isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY
    },
    xendit: {
      secretKey: process.env.XENDIT_SECRET_KEY
    }
  };

  return configs[provider];
};

export const getPaymentGatewayClient = (provider: string) => {
  const clients: { [key: string]: any } = {
    midtrans: {
      snap: 'midtrans-client',
      core: 'midtrans-client'
    },
    xendit: {
      invoice: 'xendit-node'
    }
  };

  return clients[provider];
};

export const getPaymentGatewayUrl = (payment: Payment) => {
  const urls: { [key: string]: string } = {
    midtrans: process.env.MIDTRANS_IS_PRODUCTION === 'true'
      ? 'https://app.midtrans.com'
      : 'https://app.sandbox.midtrans.com',
    xendit: process.env.XENDIT_IS_PRODUCTION === 'true'
      ? 'https://api.xendit.co'
      : 'https://api-staging.xendit.co'
  };

  return urls[payment.provider];
};

export const getPaymentGatewayWebhookUrl = (payment: Payment) => {
  const baseUrl = process.env.APP_URL;
  return `${baseUrl}/api/v1/payment/webhook/${payment.provider}`;
};

export const validatePaymentGatewayResponse = (provider: string, response: any) => {
  const validators: { [key: string]: (response: any) => boolean } = {
    midtrans: (response) => {
      return response && response.transaction_status;
    },
    xendit: (response) => {
      return response && response.status;
    }
  };

  return validators[provider]?.(response) || false;
};

export const getPaymentGatewayStatus = (provider: string, response: any) => {
  const statusMappers: { [key: string]: (response: any) => string } = {
    midtrans: (response) => {
      const statusMap: { [key: string]: string } = {
        'capture': 'completed',
        'settlement': 'completed',
        'pending': 'processing',
        'deny': 'failed',
        'cancel': 'failed',
        'expire': 'failed',
        'refund': 'refunded'
      };
      return statusMap[response.transaction_status] || 'failed';
    },
    xendit: (response) => {
      const statusMap: { [key: string]: string } = {
        'PAID': 'completed',
        'PENDING': 'processing',
        'EXPIRED': 'failed',
        'FAILED': 'failed',
        'REFUNDED': 'refunded'
      };
      return statusMap[response.status] || 'failed';
    }
  };

  return statusMappers[provider]?.(response) || 'failed';
};

export const formatPaymentGatewayError = (provider: string, error: any) => {
  const formatters: { [key: string]: (error: any) => string } = {
    midtrans: (error) => {
      return error.message || 'Midtrans payment error';
    },
    xendit: (error) => {
      return error.message || 'Xendit payment error';
    }
  };

  return formatters[provider]?.(error) || 'Payment gateway error';
}; 