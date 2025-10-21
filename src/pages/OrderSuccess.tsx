import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const OrderSuccess: React.FC = () => {
  const location = useLocation() as any;
  const navigate = useNavigate();
  const { trackingNumber } = location.state || {};

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-xl border p-10 text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-2xl">✓</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Order Placed Successfully!</h2>
          <p className="text-gray-600 mt-2">Your shipment is confirmed.</p>

          <div className="bg-gray-50 rounded-lg p-4 mt-6 inline-block text-left">
            <div className="text-gray-500 text-sm">Tracking Number</div>
            <div className="font-mono text-gray-900 mt-1 break-all">{trackingNumber || 'N/A'}</div>
          </div>

          <div className="mt-6 flex gap-3 justify-center">
            <button onClick={() => navigate('/tracking')} className="px-6 py-3 rounded-lg bg-blue-600 text-white">Track Order</button>
            <button onClick={() => navigate('/orders')} className="px-6 py-3 rounded-lg bg-gray-100 text-gray-800">My Orders</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;


