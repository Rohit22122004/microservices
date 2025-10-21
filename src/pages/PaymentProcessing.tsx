import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const PaymentProcessing: React.FC = () => {
  const location = useLocation() as any;
  const navigate = useNavigate();
  const payload = location.state || {};

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<any>(null);

  useEffect(() => {
    let polling: any;
    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        // Validate userId needed for GET polling
        if (!payload?.userId) {
          throw new Error('Missing userId. Cannot poll payment status.');
        }

        // Start polling GET /api/payments/user/{userId}
        const poll = async () => {
          try {
            const res = await fetch(`http://localhost:8084/api/payments/user/${payload.userId}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
              }
            });

            if (!res.ok) {
              // Keep polling on non-200 until timeout; log but don't break
              return;
            }

            const data = await res.json();

            // Heuristic: when API returns an object/array with a completed/processed payment, stop
            const record = Array.isArray(data) ? data[0] : (data?.payment || data);
            if (record) {
              setResponse(data);
              clearInterval(polling);
              setLoading(false);
              const transactionId = record.transactionId || record.id || record.transaction_id;
              const paymentId = record.paymentId || record.payment_id || record.id;
              // Persist for downstream pages (shipping)
              try {
                const prev = JSON.parse(localStorage.getItem('lastPaymentData') || 'null') || {};
                localStorage.setItem('lastPaymentData', JSON.stringify({
                  ...prev,
                  userId: payload.userId,
                  transactionId,
                  paymentId
                }));
              } catch {}
              // Navigate to success page with ids and userId
              navigate('/payment/success', { state: { transactionId, paymentId, response: data, userId: payload.userId } });
            }
          } catch (_) {
            // ignore transient errors
          }
        };

        // Immediate poll once, then interval
        await poll();
        polling = setInterval(poll, 1500);
      } catch (e: any) {
        setError(e?.message || 'Unknown error');
        setLoading(false);
      }
    };

    run();
    return () => polling && clearInterval(polling);
  }, []);

  // Derive common ids from response
  const transactionId = response?.transactionId || response?.id || response?.transaction_id || response?.payment?.transactionId;
  const paymentId = response?.paymentId || response?.payment_id || response?.payment?.id;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 py-10">
        {loading ? (
          <div className="soft-card rounded-3xl p-10 text-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {/* Brand spinner */}
              <div className="mx-auto mb-4 h-12 w-12 rounded-full border-4 border-[var(--brand-3)] border-t-[var(--brand-2)] border-r-transparent border-b-transparent animate-spin"></div>
              <h2 className="text-xl font-semibold text-gray-900">Processing Payment...</h2>
              <p className="mt-2 text-gray-600">Please wait while we complete your transaction.</p>
            </motion.div>
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl border p-10 text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Payment Failed</h2>
            <p className="text-gray-700 mb-6">{error}</p>
            <button onClick={() => navigate(-1)} className="px-6 py-3 rounded-lg bg-gray-800 text-white">Go Back</button>
          </div>
        ) : (
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
                <div className="font-mono text-gray-900 mt-1 break-all">{transactionId || 'N/A'}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-gray-500 text-sm">Payment ID</div>
                <div className="font-mono text-gray-900 mt-1 break-all">{paymentId || 'N/A'}</div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mt-6">
              <div className="text-gray-500 text-sm mb-2">Response</div>
              <pre className="text-xs text-gray-700 overflow-auto max-h-64 bg-white p-3 rounded border">{JSON.stringify(response, null, 2)}</pre>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={() => navigate('/orders')} className="px-6 py-3 rounded-lg bg-blue-600 text-white">View Orders</button>
              <button onClick={() => navigate('/')} className="px-6 py-3 rounded-lg bg-gray-100 text-gray-800">Home</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentProcessing;


