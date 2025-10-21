import React, { useState } from 'react';
import toast from 'react-hot-toast';

const AdminShipping: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);

  const confirmShipping = async () => {
    if (!userId) {
      toast.error('Please enter user id');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:8085/api/shipping/shipments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: 12345,
          userId: Number(userId),
          carrier: 'FEDEX',
          carrierService: 'Express',
          fromAddress: {
            street: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA'
          },
          toAddress: {
            street: '456 Oak Ave',
            city: 'Los Angeles',
            state: 'CA',
            zipCode: '90210',
            country: 'USA'
          },
          weight: 2.5,
          length: 30.0,
          width: 20.0,
          height: 15.0,
          notes: 'Handle with care - fragile items'
        })
      });
      if (!res.ok) {
        const t = await res.text();
        throw new Error(t || 'Shipping request failed');
      }
      toast.success('Shipping created');
    } catch (e: any) {
      toast.error(e.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Create Shipment</h1>
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
          disabled={loading}
          onClick={confirmShipping}
          className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-primary-600 to-secondary-600 px-5 py-2.5 text-white text-sm font-medium hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-60"
        >
          {loading ? 'Processing...' : 'Confirm'}
        </button>
      </div>
    </div>
  );
};

export default AdminShipping;
