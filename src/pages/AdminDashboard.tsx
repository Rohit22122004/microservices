import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const [userId, setUserId] = useState('');

  const confirmPayment = async () => {
    try {
      const res = await fetch('http://localhost:8084/api/payments/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: 1231,
          userId: Number(userId),
          amount: 99.99,
          currency: 'USD',
          paymentMethod: 'CREDIT_CARD',
          paymentMethodId: 'pm_abc123',
          cardToken: 'tok_visa1234'
        })
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || 'Payment failed');
      }
      toast.success('Payment processed');
    } catch (e: any) {
      toast.error(e.message || 'Something went wrong');
    }
  };
  const navigate = useNavigate();
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-gray-600 mb-6">Welcome, Admin. Use this dashboard to manage the application.</p>
      <div className="flex items-end gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
          <input
            type="number"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="mt-1 block w-60 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            placeholder="Enter user id"
          />
        </div>
        <button
          type="button"
          onClick={confirmPayment}
          className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 px-5 py-2.5 text-white text-sm font-medium hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Confirm Payment
        </button>
        <button
          type="button"
          onClick={() => navigate('/admin/shipping')}
          className="inline-flex items-center justify-center rounded-lg bg-gray-800 px-5 py-2.5 text-white text-sm font-medium hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-600"
        >
          Shipping
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
