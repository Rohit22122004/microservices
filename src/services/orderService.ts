export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  shippingMethod: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  notes?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Address {
  id?: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  RETURNED = 'returned',
  REFUNDED = 'refunded'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export interface OrderTrackingEvent {
  id: string;
  orderId: string;
  status: OrderStatus;
  message: string;
  location?: string;
  timestamp: string;
}

export interface RefundRequest {
  orderId: string;
  reason: string;
  amount: number;
  items: string[];
  description?: string;
}

export interface CancellationRequest {
  orderId: string;
  reason: string;
  description?: string;
}

class OrderService {
  private baseUrl = process.env.REACT_APP_ORDER_SERVICE_URL || 'http://localhost:8083';

  async createOrder(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    try {
      const response = await fetch(`${this.baseUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      return await response.json();
    } catch (error) {
      console.error('Order creation failed:', error);
      throw error;
    }
  }

  async getOrder(orderId: string): Promise<Order> {
    try {
      const response = await fetch(`${this.baseUrl}/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch order:', error);
      throw error;
    }
  }

  async getUserOrders(userId: string, page = 1, limit = 10): Promise<{ orders: Order[], total: number }> {
    try {
      const response = await fetch(`${this.baseUrl}/orders/user/${userId}?page=${page}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user orders');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch user orders:', error);
      throw error;
    }
  }

  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    try {
      const response = await fetch(`${this.baseUrl}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to update order status:', error);
      throw error;
    }
  }

  async trackOrder(orderId: string): Promise<OrderTrackingEvent[]> {
    try {
      const response = await fetch(`${this.baseUrl}/orders/${orderId}/tracking`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch order tracking');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch order tracking:', error);
      throw error;
    }
  }

  async cancelOrder(orderId: string, cancellationData: CancellationRequest): Promise<Order> {
    try {
      const response = await fetch(`${this.baseUrl}/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(cancellationData)
      });

      if (!response.ok) {
        throw new Error('Failed to cancel order');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to cancel order:', error);
      throw error;
    }
  }

  async requestRefund(refundData: RefundRequest): Promise<{ success: boolean; refundId: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/orders/refund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(refundData)
      });

      if (!response.ok) {
        throw new Error('Failed to request refund');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to request refund:', error);
      throw error;
    }
  }

  async returnOrder(orderId: string, returnData: { reason: string; items: string[]; description?: string }): Promise<{ success: boolean; returnId: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/orders/${orderId}/return`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(returnData)
      });

      if (!response.ok) {
        throw new Error('Failed to process return');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to process return:', error);
      throw error;
    }
  }
}

export const orderService = new OrderService();
