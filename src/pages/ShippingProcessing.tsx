import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ShippingProcessing: React.FC = () => {
  const location = useLocation() as any;
  const navigate = useNavigate();
  const state = location.state || {};
  const storedPaymentData = (() => {
    try { return JSON.parse(localStorage.getItem('lastPaymentData') || 'null'); } catch { return null; }
  })();
  const initialUserId = state.userId || storedPaymentData?.userId || '';
  const [userId, setUserId] = useState<string | number>(initialUserId);
  const [userIdInput, setUserIdInput] = useState<string>(String(initialUserId || ''));
  const [hasStarted, setHasStarted] = useState<boolean>(Boolean(initialUserId));

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let polling: any;
    const run = async () => {
      try {
        if (!userId) {
          throw new Error('Missing userId to check shipment status.');
        }
        const poll = async () => {
          try {
            const res = await fetch(`http://localhost:8085/api/shipping/shipments/user/${userId}`, {
              headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || ''}` }
            });
            if (!res.ok) return; // keep polling
            const data = await res.json();
            const shipment = Array.isArray(data) ? data[0] : (data?.shipment || data);
            if (shipment) {
              const trackingNumber = shipment.trackingNumber || shipment.tracking_number || shipment.trackingId;
              clearInterval(polling);
              navigate('/order/success', { state: { trackingNumber, shipment: data } });
            }
          } catch (_) {}
        };
        await poll();
        polling = setInterval(poll, 1500);
      } catch (e: any) {
        setError(e?.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    if (hasStarted) {
      run();
    }
    return () => polling && clearInterval(polling);
  }, [userId, hasStarted, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 py-10">
        {!hasStarted && (
          <div className="bg-white rounded-xl border p-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Enter User ID to check shipment</h2>
            <div className="flex gap-3 items-center">
              <input
                type="number"
                value={userIdInput}
                onChange={(e) => setUserIdInput(e.target.value)}
                placeholder="e.g. 1001"
                className="flex-1 border rounded-lg px-3 py-2"
              />
              <button
                onClick={() => { setUserId(userIdInput); setHasStarted(true); setLoading(true); setError(null); }}
                className="px-6 py-2 rounded-lg bg-blue-600 text-white"
              >
                Start
              </button>
            </div>
            <p className="text-gray-500 text-sm mt-3">We will poll the shipping service and navigate once your shipment is confirmed.</p>
          </div>
        )}
        {hasStarted && (error ? (
          <div className="bg-white rounded-xl border p-10 text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Unable to check shipment</h2>
            <p className="text-gray-700">{error}</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border p-10 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900">Waiting for shipment confirmation...</h2>
            <p className="text-gray-600 mt-2">We will move ahead as soon as we receive shipping details.</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShippingProcessing;


