import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCardIcon, LockClosedIcon, PlusIcon } from '@heroicons/react/24/outline';
import { PaymentMethod, paymentService } from '../../services/paymentService';
import { useStore } from '../../store/useStore';
import toast from 'react-hot-toast';

interface CheckoutFormProps {
  total: number;
  onPaymentSuccess: (transactionId: string) => void;
  onCancel: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ total, onPaymentSuccess, onCancel }) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [showAddCard, setShowAddCard] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [newCard, setNewCard] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
    zipCode: ''
  });

  const { user } = useStore();

  useEffect(() => {
    if (user) {
      loadPaymentMethods();
    }
  }, [user]);

  const loadPaymentMethods = async () => {
    try {
      const methods = await paymentService.getPaymentMethods(user!.id);
      setPaymentMethods(methods);
      const defaultMethod = methods.find(m => m.isDefault);
      if (defaultMethod) {
        setSelectedMethod(defaultMethod.id);
      }
    } catch (error) {
      toast.error('Failed to load payment methods');
    }
  };

  const handleAddCard = async () => {
    try {
      setProcessing(true);
      // In a real app, you'd tokenize the card with Stripe/etc first
      const method = await paymentService.addPaymentMethod({
        type: 'card',
        provider: 'stripe',
        token: 'mock_token_' + Date.now(), // Mock token
        isDefault: paymentMethods.length === 0
      });
      
      setPaymentMethods([...paymentMethods, method]);
      setSelectedMethod(method.id);
      setShowAddCard(false);
      setNewCard({ number: '', expiry: '', cvv: '', name: '', zipCode: '' });
      toast.success('Payment method added successfully');
    } catch (error) {
      toast.error('Failed to add payment method');
    } finally {
      setProcessing(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedMethod) {
      toast.error('Please select a payment method');
      return;
    }

    try {
      setProcessing(true);
      
      // Create payment intent
      const paymentIntent = await paymentService.createPaymentIntent({
        amount: total * 100, // Convert to cents
        currency: 'usd',
        orderId: 'temp_order_' + Date.now(),
        paymentMethodId: selectedMethod
      });

      // Confirm payment
      const confirmedPayment = await paymentService.confirmPayment(
        paymentIntent.id,
        selectedMethod
      );

      if (confirmedPayment.status === 'succeeded') {
        toast.success('Payment successful!');
        onPaymentSuccess(confirmedPayment.id);
      } else {
        toast.error('Payment failed. Please try again.');
      }
    } catch (error) {
      toast.error('Payment processing failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Checkout</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="mb-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-blue-600">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
            <button
              onClick={() => setShowAddCard(true)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
            >
              <PlusIcon className="w-4 h-4" />
              Add Card
            </button>
          </div>

          {paymentMethods.map((method) => (
            <motion.div
              key={method.id}
              whileHover={{ scale: 1.02 }}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedMethod === method.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CreditCardIcon className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {method.brand?.toUpperCase() || method.provider}
                    </p>
                    {method.last4 && (
                      <p className="text-sm text-gray-500">•••• {method.last4}</p>
                    )}
                  </div>
                </div>
                {method.isDefault && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    Default
                  </span>
                )}
              </div>
            </motion.div>
          ))}

          {showAddCard && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  value={newCard.number}
                  onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry
                  </label>
                  <input
                    type="text"
                    value={newCard.expiry}
                    onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={newCard.cvv}
                    onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                    placeholder="123"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleAddCard}
                  disabled={processing}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm"
                >
                  Add Card
                </button>
                <button
                  onClick={() => setShowAddCard(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </div>

        <div className="flex items-center justify-center mb-4">
          <LockClosedIcon className="w-4 h-4 text-gray-400 mr-2" />
          <span className="text-sm text-gray-500">Your payment information is secure</span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePayment}
            disabled={processing || !selectedMethod}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
          >
            {processing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default CheckoutForm;
