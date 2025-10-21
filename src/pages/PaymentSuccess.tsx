import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentSuccess: React.FC = () => {
  const location = useLocation() as any;
  const navigate = useNavigate();
  const state = location.state || {};
  // Try to derive userId from state, response, or localStorage fallback
  const storedPaymentData = (() => {
    try { return JSON.parse(localStorage.getItem('lastPaymentData') || 'null'); } catch { return null; }
  })();
  const derivedUserId =
    state.userId ||
    state?.response?.userId ||
    state?.response?.user_id ||
    state?.response?.payment?.userId ||
    storedPaymentData?.userId;

  const transactionId = state.transactionId || 'N/A';
  const paymentId = state.paymentId || 'N/A';

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="bg-white rounded-xl border p-10">
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Payment Successful</h2>
            <p className="text-gray-600 mt-2">Your payment has been processed.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-gray-500 text-sm">Transaction ID</div>
              <div className="font-mono text-gray-900 mt-1 break-all">{transactionId}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-gray-500 text-sm">Payment ID</div>
              <div className="font-mono text-gray-900 mt-1 break-all">{paymentId}</div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={() => navigate('/shipping/processing', { state: { userId: derivedUserId } })} className="px-6 py-3 rounded-lg bg-blue-600 text-white">View Orders</button>
            <button onClick={() => navigate('/')} className="px-6 py-3 rounded-lg bg-gray-100 text-gray-800">Home</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;


