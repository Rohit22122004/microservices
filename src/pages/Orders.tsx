import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Order } from '../services/orderService';
import OrderCard from '../components/Orders/OrderCard';
import OrderTracking from '../components/Orders/OrderTracking';

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [trackingFor, setTrackingFor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get user ID from successful payment response stored in localStorage
  const getUserId = () => {
    try {
      const paymentData = localStorage.getItem('lastPaymentData');
      if (paymentData) {
        const parsed = JSON.parse(paymentData);
        return parsed.userId || '1001';
      }
    } catch (e) {
      console.warn('Failed to parse payment data from localStorage');
    }
    return '1001'; // fallback
  };

  const userId = getUserId();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`http://localhost:8083/api/orders/orders/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch orders: ${response.statusText}`);
        }

        const data = await response.json();
        setOrders(data.orders || data || []);
      } catch (e: any) {
        console.error('Failed to load orders', e);
        setError(e.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userId]);

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 animate-gradient-y">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
            <button 
              onClick={() => window.location.href = '/products'} 
              className="px-6 py-3 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-500 text-white rounded-lg hover:shadow-xl transition-all duration-200 font-medium animate-pulse-slow"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onViewDetails={() => {}}
                onTrackOrder={(id) => setTrackingFor(id)}
              />
            ))}
          </div>
        )}

        {trackingFor && (
          <OrderTracking orderId={trackingFor} onClose={() => setTrackingFor(null)} />
        )}
      </div>
    </div>
  );
};

export default OrdersPage;


