import React, { useMemo, useState } from 'react';
import { useStore } from '../store/useStore';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Checkout: React.FC = () => {
  const { cart } = useStore();

  const computedTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity || 0)), 0);
  }, [cart]);

  const [form, setForm] = useState({
    userId: '',
    shippingAddress: '',
    billingAddress: '',
    paymentMethod: 'Credit Card',
    shippingMethod: 'Standard Shipping',
    notes: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ orderNumber: string; status: string; paymentStatus: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setResult(null);

    try {
      if (!form.userId) {
        throw new Error('Please enter a valid User ID');
      }
      if (cart.length === 0) {
        throw new Error('Your cart is empty');
      }
      const payload = {
        userId: Number(form.userId),
        totalAmount: Number(computedTotal.toFixed(2)),
        shippingAddress: form.shippingAddress,
        billingAddress: form.billingAddress,
        paymentMethod: form.paymentMethod,
        shippingMethod: form.shippingMethod,
        notes: form.notes,
        orderItems: cart.map(item => ({
          productId: item.id,
          productName: item.name,
          productImage: item.image,
          quantity: item.quantity,
          unitPrice: item.price,
          selectedColor: item.selectedColor,
          selectedSize: item.selectedSize
        }))
      };

      const res = await fetch('http://localhost:8083/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        // Try to extract error message
        let message = 'Failed to place order';
        try {
          const errJson = await res.json();
          message = errJson?.message || message;
        } catch (_) {
          const text = await res.text();
          if (text) message = text;
        }
        throw new Error(message);
      }

      const data = await res.json();
      const orderId = data.orderNumber || data.id || data.orderId || data.order_id || `temp_${Date.now()}`;
      const placed = {
        orderNumber: orderId,
        status: data.status || 'pending',
        paymentStatus: data.paymentStatus || 'pending'
      };
      setResult(placed);

      // Navigate to payment page with required context
      navigate('/payment', {
        state: {
          orderId,
          userId: Number(form.userId),
          amount: Number(computedTotal.toFixed(2)),
          paymentMethod: form.paymentMethod,
          currency: 'USD',
          orderResponse: placed,
        }
      });
      toast.success('Order placed. Proceed to payment.');
    } catch (err: any) {
      setError(err?.message || 'Something went wrong');
      toast.error(err?.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 animate-gradient-xy">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>

        {/* Cart Summary */}
        <div className="mb-8 bg-gradient-to-r from-white via-green-50 to-blue-50 rounded-xl p-6 shadow-lg border border-white/50">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2">
            {cart.map(item => (
              <div key={`${item.id}-${item.selectedColor}-${item.selectedSize}`} className="flex justify-between text-sm text-gray-700">
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span>
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>${computedTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-gradient-to-r from-white via-blue-50 to-purple-50 rounded-xl p-6 shadow-lg border border-white/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
              <input name="userId" value={form.userId} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2" placeholder="e.g. 1001" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
                <option>Credit Card</option>
                <option>Debit Card</option>
                <option>UPI</option>
                <option>Cash on Delivery</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Method</label>
              <select name="shippingMethod" value={form.shippingMethod} onChange={handleChange} className="w-full border rounded-lg px-3 py-2">
                <option>Standard Shipping</option>
                <option>Express Shipping</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
            <textarea name="shippingAddress" value={form.shippingAddress} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2" rows={2} placeholder="123 Main St, City, ZIP, Country" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Billing Address</label>
            <textarea name="billingAddress" value={form.billingAddress} onChange={handleChange} required className="w-full border rounded-lg px-3 py-2" rows={2} placeholder="Same as shipping if applicable" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" rows={2} placeholder="Any delivery instructions" />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <motion.button
            whileHover={{ scale: 1.02, rotate: 1 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={submitting || cart.length === 0}
            className="px-6 py-3 rounded-lg text-white bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-500 disabled:opacity-60 shadow-lg hover:shadow-xl animate-pulse-slow"
          >
            {submitting ? 'Placing Order...' : 'Place Order'}
          </motion.button>
        </form>

        {result && (
          <div className="mt-8 bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 rounded-xl p-6 shadow-lg border border-white/50">
            <h2 className="text-xl font-semibold mb-4">Order Placed</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-500">Order Number</div>
                <div className="font-medium">{result.orderNumber}</div>
              </div>
              <div>
                <div className="text-gray-500">Status</div>
                <div className="font-medium">{result.status}</div>
              </div>
              <div>
                <div className="text-gray-500">Payment Status</div>
                <div className="font-medium">{result.paymentStatus}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;


