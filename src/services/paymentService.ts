export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'stripe' | 'razorpay' | 'bank_transfer';
  provider: string;
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  billingAddress?: Address;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: PaymentIntentStatus;
  clientSecret?: string;
  orderId: string;
  paymentMethodId: string;
  metadata?: Record<string, any>;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  paymentMethod: PaymentMethod;
  gateway: PaymentGateway;
  gatewayTransactionId: string;
  createdAt: string;
  processedAt?: string;
  failureReason?: string;
  refunds?: Refund[];
}

export interface Refund {
  id: string;
  transactionId: string;
  amount: number;
  reason: string;
  status: RefundStatus;
  createdAt: string;
  processedAt?: string;
}

export interface Invoice {
  id: string;
  orderId: string;
  invoiceNumber: string;
  amount: number;
  tax: number;
  total: number;
  currency: string;
  status: InvoiceStatus;
  dueDate: string;
  paidAt?: string;
  downloadUrl?: string;
}

export enum PaymentIntentStatus {
  REQUIRES_PAYMENT_METHOD = 'requires_payment_method',
  REQUIRES_CONFIRMATION = 'requires_confirmation',
  REQUIRES_ACTION = 'requires_action',
  PROCESSING = 'processing',
  SUCCEEDED = 'succeeded',
  CANCELED = 'canceled'
}

export enum TransactionStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELED = 'canceled',
  REFUNDED = 'refunded'
}

export enum RefundStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export enum InvoiceStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELED = 'canceled'
}

export enum PaymentGateway {
  STRIPE = 'stripe',
  PAYPAL = 'paypal',
  RAZORPAY = 'razorpay',
  SQUARE = 'square'
}

export interface Address {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface FraudCheck {
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high';
  checks: {
    cvv: boolean;
    address: boolean;
    zipCode: boolean;
  };
  recommendation: 'approve' | 'review' | 'decline';
}

class PaymentService {
  private baseUrl = process.env.REACT_APP_PAYMENT_SERVICE_URL || 'http://localhost:8084';

  async createPaymentIntent(data: {
    amount: number;
    currency: string;
    orderId: string;
    paymentMethodId?: string;
    metadata?: Record<string, any>;
  }): Promise<PaymentIntent> {
    try {
      const response = await fetch(`${this.baseUrl}/payment-intents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      return await response.json();
    } catch (error) {
      console.error('Payment intent creation failed:', error);
      throw error;
    }
  }

  async confirmPayment(paymentIntentId: string, paymentMethodId: string): Promise<PaymentIntent> {
    try {
      const response = await fetch(`${this.baseUrl}/payment-intents/${paymentIntentId}/confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ paymentMethodId })
      });

      if (!response.ok) {
        throw new Error('Failed to confirm payment');
      }

      return await response.json();
    } catch (error) {
      console.error('Payment confirmation failed:', error);
      throw error;
    }
  }

  async processPayment(data: {
    orderId: string;
    paymentMethodId: string;
    amount: number;
    currency: string;
    gateway: PaymentGateway;
  }): Promise<PaymentTransaction> {
    try {
      const response = await fetch(`${this.baseUrl}/payments/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Payment processing failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Payment processing failed:', error);
      throw error;
    }
  }

  async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    try {
      const response = await fetch(`${this.baseUrl}/payment-methods/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment methods');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
      throw error;
    }
  }

  async addPaymentMethod(data: {
    type: string;
    provider: string;
    token: string;
    billingAddress?: Address;
    isDefault?: boolean;
  }): Promise<PaymentMethod> {
    try {
      const response = await fetch(`${this.baseUrl}/payment-methods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to add payment method');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to add payment method:', error);
      throw error;
    }
  }

  async removePaymentMethod(paymentMethodId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/payment-methods/${paymentMethodId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove payment method');
      }
    } catch (error) {
      console.error('Failed to remove payment method:', error);
      throw error;
    }
  }

  async getTransaction(transactionId: string): Promise<PaymentTransaction> {
    try {
      const response = await fetch(`${this.baseUrl}/transactions/${transactionId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transaction');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch transaction:', error);
      throw error;
    }
  }

  async getOrderTransactions(orderId: string): Promise<PaymentTransaction[]> {
    try {
      const response = await fetch(`${this.baseUrl}/transactions/order/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch order transactions');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch order transactions:', error);
      throw error;
    }
  }

  async refundPayment(transactionId: string, data: {
    amount?: number;
    reason: string;
  }): Promise<Refund> {
    try {
      const response = await fetch(`${this.baseUrl}/transactions/${transactionId}/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to process refund');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to process refund:', error);
      throw error;
    }
  }

  async generateInvoice(orderId: string): Promise<Invoice> {
    try {
      const response = await fetch(`${this.baseUrl}/invoices/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ orderId })
      });

      if (!response.ok) {
        throw new Error('Failed to generate invoice');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to generate invoice:', error);
      throw error;
    }
  }

  async getInvoice(invoiceId: string): Promise<Invoice> {
    try {
      const response = await fetch(`${this.baseUrl}/invoices/${invoiceId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch invoice');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch invoice:', error);
      throw error;
    }
  }

  async downloadInvoice(invoiceId: string): Promise<Blob> {
    try {
      const response = await fetch(`${this.baseUrl}/invoices/${invoiceId}/download`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to download invoice');
      }

      return await response.blob();
    } catch (error) {
      console.error('Failed to download invoice:', error);
      throw error;
    }
  }

  async performFraudCheck(data: {
    amount: number;
    paymentMethodId: string;
    billingAddress: Address;
    ipAddress: string;
  }): Promise<FraudCheck> {
    try {
      const response = await fetch(`${this.baseUrl}/fraud-check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Failed to perform fraud check');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to perform fraud check:', error);
      throw error;
    }
  }

  async getPaymentGateways(): Promise<{ gateway: PaymentGateway; enabled: boolean; fees: number }[]> {
    try {
      const response = await fetch(`${this.baseUrl}/gateways`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch payment gateways');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch payment gateways:', error);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();
