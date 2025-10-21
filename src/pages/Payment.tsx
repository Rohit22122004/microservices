import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CreditCardIcon, 
  PlusIcon, 
  ShieldCheckIcon,
  BanknotesIcon,
  ClockIcon,
  CheckCircleIcon,
  ShoppingBagIcon,
  DocumentTextIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import PaymentMethodCard from '../components/Payment/PaymentMethodCard';
import { PaymentMethod, paymentService } from '../services/paymentService';
import { Order, OrderStatus, PaymentStatus, orderService } from '../services/orderService';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

const Payment: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddCard, setShowAddCard] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [recentOrder, setRecentOrder] = useState<any>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [showRawResponse, setShowRawResponse] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentResponse, setPaymentResponse] = useState<any>(null);
  const [paymentForm, setPaymentForm] = useState({
    orderId: '',
    currency: 'USD',
    paymentMethodId: '',
    cardToken: ''
  });
  const [newCard, setNewCard] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
    zipCode: ''
  });

  const { user, setUser } = useStore();
  const location = useLocation() as any;
  const navigate = useNavigate();
  const checkoutCtx = (location.state || {}) as { orderId?: string | number; userId?: number; amount?: number; paymentMethod?: string; currency?: string };

  useEffect(() => {
    if (user) {
      loadPaymentMethods();
    } else {
      // If no user, set loading to false and show empty state
      setLoading(false);
      // For demonstration purposes, set a mock user
      const mockUser = {
        id: '1001',
        name: 'Demo User',
        email: 'demo@example.com'
      };
      // You can uncomment this line to set a mock user for testing
      // setUser(mockUser);
    }
  }, [user]);

  const loadPaymentMethods = async () => {
    try {
      setLoading(true);
      const methods = await paymentService.getPaymentMethods(user!.id);
      setPaymentMethods(methods);
    } catch (error) {
      console.log('API call failed, using mock data for demonstration');
      // Use mock data for demonstration
      const mockMethods = [
        {
          id: 'pm_1',
          type: 'card' as const,
          provider: 'stripe',
          last4: '4242',
          brand: 'visa',
          expiryMonth: 12,
          expiryYear: 2025,
          isDefault: true,
          billingAddress: {
            name: 'Demo User',
            street: '123 Demo St',
            city: 'Demo City',
            state: 'DC',
            zipCode: '12345',
            country: 'USA'
          }
        },
        {
          id: 'pm_2',
          type: 'card' as const,
          provider: 'stripe',
          last4: '5555',
          brand: 'mastercard',
          expiryMonth: 6,
          expiryYear: 2026,
          isDefault: false,
          billingAddress: {
            name: 'Demo User',
            street: '123 Demo St',
            city: 'Demo City',
            state: 'DC',
            zipCode: '12345',
            country: 'USA'
          }
        }
      ];
      setPaymentMethods(mockMethods);
      toast.success('Demo payment methods loaded');
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async () => {
    if (!newCard.number || !newCard.expiry || !newCard.cvv || !newCard.name) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setProcessing(true);
      const method = await paymentService.addPaymentMethod({
        type: 'card',
        provider: 'stripe',
        token: 'mock_token_' + Date.now(),
        isDefault: paymentMethods.length === 0,
        billingAddress: {
          name: newCard.name,
          street: '',
          city: '',
          state: '',
          zipCode: newCard.zipCode,
          country: 'US'
        }
      });
      
      setPaymentMethods([...paymentMethods, method]);
      setShowAddCard(false);
      setNewCard({ number: '', expiry: '', cvv: '', name: '', zipCode: '' });
      toast.success('Payment method added successfully');
    } catch (error) {
      toast.error('Failed to add payment method');
    } finally {
      setProcessing(false);
    }
  };

  const handleDeletePaymentMethod = async (id: string) => {
    try {
      await paymentService.removePaymentMethod(id);
      setPaymentMethods(paymentMethods.filter(method => method.id !== id));
      toast.success('Payment method removed successfully');
    } catch (error) {
      toast.error('Failed to remove payment method');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      // In a real app, you'd call an API to set default payment method
      setPaymentMethods(paymentMethods.map(method => ({
        ...method,
        isDefault: method.id === id
      })));
      toast.success('Default payment method updated');
    } catch (error) {
      toast.error('Failed to update default payment method');
    }
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Please log in to place an order');
      return;
    }

    if (paymentMethods.length === 0) {
      toast.error('Please add a payment method first');
      return;
    }

    try {
      setPlacingOrder(true);
      
      // Fetch orders from the API
      const response = await fetch('http://localhost:8083/api/orders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.statusText}`);
      }

      const ordersData = await response.json();
      console.log('Orders API Response:', ordersData);
      
      // Store the raw API response
      setApiResponse(ordersData);
      
      // Get the most recent order or first order from the response
      let selectedOrder;
      if (Array.isArray(ordersData)) {
        selectedOrder = ordersData[0]; // Get first order
      } else if (ordersData.orders && Array.isArray(ordersData.orders)) {
        selectedOrder = ordersData.orders[0]; // Get first order from orders array
      } else if (ordersData.id) {
        selectedOrder = ordersData; // Single order object
      } else {
        throw new Error('Unexpected API response format');
      }

      if (!selectedOrder) {
        throw new Error('No orders found in API response');
      }

      // Store payment data for orders page
      localStorage.setItem('lastPaymentData', JSON.stringify({
        userId: user.id,
        orderId: selectedOrder.id,
        amount: selectedOrder.totalAmount,
        paymentMethod: selectedOrder.paymentMethod
      }));

      setRecentOrder(selectedOrder);
      toast.success('Order data loaded successfully!');
      
    } catch (error: any) {
      console.error('Failed to fetch orders:', error);
      toast.error(`Failed to fetch orders: ${(error as Error).message || 'Unknown error'}`);
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleProcessPayment = async () => {
    if (!paymentForm.orderId || !paymentForm.paymentMethodId || !paymentForm.cardToken) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Navigate to processing screen with all required payload, taking amount/userId/paymentMethod from Checkout context
    const payload = {
      orderId: Number(paymentForm.orderId),
      userId: checkoutCtx.userId ?? Number(user?.id || 0),
      amount: checkoutCtx.amount ?? 0,
      currency: paymentForm.currency || checkoutCtx.currency || 'USD',
      paymentMethod: checkoutCtx.paymentMethod || 'CREDIT_CARD',
      paymentMethodId: paymentForm.paymentMethodId,
      cardToken: paymentForm.cardToken,
    };
    navigate('/payment/processing', { state: payload });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment methods...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md mx-4"
        >
          <CreditCardIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-600 mb-6">Please log in to manage your payment methods and process payments.</p>
          <div className="flex gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.href = '/login'}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Login
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                const mockUser = {
                  id: '1001',
                  name: 'Demo User',
                  email: 'demo@example.com'
                };
                setUser(mockUser);
              }}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Demo Mode
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <CreditCardIcon className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Payment Methods</h1>
          </div>
          <p className="text-gray-600">Manage your payment methods and billing information</p>
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8"
        >
          <div className="flex items-center gap-3">
            <ShieldCheckIcon className="w-5 h-5 text-green-600" />
            <div>
              <h3 className="font-medium text-green-900">Secure Payment Processing</h3>
              <p className="text-sm text-green-700">
                Your payment information is encrypted and secure. We never store your full card details.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Payment Methods Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Payment Methods</h2>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAddCard(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <PlusIcon className="w-4 h-4" />
                Add Payment Method
              </motion.button>
              {paymentMethods.length > 0 && (
                <>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePlaceOrder}
                    disabled={placingOrder}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    <ShoppingBagIcon className="w-4 h-4" />
                    {placingOrder ? 'Placing Order...' : 'Place Order'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowPaymentForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <CreditCardIcon className="w-4 h-4" />
                    Process Payment
                  </motion.button>
                </>
              )}
            </div>
          </div>

          {paymentMethods.length === 0 ? (
            <div className="text-center py-12">
              <BanknotesIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No payment methods</h3>
              <p className="text-gray-500 mb-6">Add a payment method to get started</p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAddCard(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Your First Payment Method
              </motion.button>
            </div>
          ) : (
            <div className="grid gap-4">
              {paymentMethods.map((method, index) => (
                <motion.div
                  key={method.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <PaymentMethodCard
                    paymentMethod={method}
                    onDelete={handleDeletePaymentMethod}
                    onSetDefault={handleSetDefault}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Add Card Form */}
        {showAddCard && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Add New Payment Method</h2>
              <button
                onClick={() => setShowAddCard(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number *
                </label>
                <input
                  type="text"
                  value={newCard.number}
                  onChange={(e) => setNewCard({ ...newCard, number: e.target.value })}
                  placeholder="1234 5678 9012 3456"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cardholder Name *
                </label>
                <input
                  type="text"
                  value={newCard.name}
                  onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date *
                </label>
                <input
                  type="text"
                  value={newCard.expiry}
                  onChange={(e) => setNewCard({ ...newCard, expiry: e.target.value })}
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV *
                </label>
                <input
                  type="text"
                  value={newCard.cvv}
                  onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value })}
                  placeholder="123"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ZIP Code
                </label>
                <input
                  type="text"
                  value={newCard.zipCode}
                  onChange={(e) => setNewCard({ ...newCard, zipCode: e.target.value })}
                  placeholder="12345"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddCard}
                disabled={processing}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
              >
                {processing ? (
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 animate-spin" />
                    Adding...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4" />
                    Add Payment Method
                  </div>
                )}
              </motion.button>
              <button
                onClick={() => setShowAddCard(false)}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Payment Processing Form */}
        {showPaymentForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Process Payment</h2>
              <button
                onClick={() => setShowPaymentForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order ID *
                </label>
                <input
                  type="number"
                  value={paymentForm.orderId}
                  onChange={(e) => setPaymentForm({ ...paymentForm, orderId: e.target.value })}
                  placeholder="1231"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  value={paymentForm.currency}
                  onChange={(e) => setPaymentForm({ ...paymentForm, currency: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method ID *
                </label>
                <input
                  type="text"
                  value={paymentForm.paymentMethodId}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethodId: e.target.value })}
                  placeholder="pm_abc123"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Token *
                </label>
                <input
                  type="text"
                  value={paymentForm.cardToken}
                  onChange={(e) => setPaymentForm({ ...paymentForm, cardToken: e.target.value })}
                  placeholder="tok_visa1234"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleProcessPayment}
                disabled={processingPayment}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors font-medium"
              >
                {processingPayment ? (
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 animate-spin" />
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircleIcon className="w-4 h-4" />
                    Process Payment
                  </div>
                )}
              </motion.button>
              <button
                onClick={() => setShowPaymentForm(false)}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Payment Response Display */}
        {paymentResponse && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <CheckBadgeIcon className="w-6 h-6 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900">Payment Processed Successfully!</h2>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Payment Response:</h3>
              <pre className="text-sm text-gray-600 overflow-auto max-h-64 bg-white p-3 rounded border">
                {JSON.stringify(paymentResponse, null, 2)}
              </pre>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setPaymentResponse(null)}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Recent Order Display */}
        {recentOrder && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <CheckBadgeIcon className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">Order Data from API</h2>
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowRawResponse(!showRawResponse)}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  {showRawResponse ? 'Hide' : 'Show'} Raw Response
                </motion.button>
              </div>
            </div>

            {/* Raw API Response */}
            {showRawResponse && apiResponse && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6 p-4 bg-gray-50 rounded-lg border"
              >
                <h3 className="font-semibold text-gray-900 mb-2">Raw API Response:</h3>
                <pre className="text-xs text-gray-600 overflow-auto max-h-64 bg-white p-3 rounded border">
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order Details */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <DocumentTextIcon className="w-5 h-5" />
                    Order Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order Number:</span>
                      <span className="font-medium text-gray-900">#{recentOrder.id || recentOrder.orderId || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        (recentOrder.status || recentOrder.orderStatus) === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {(recentOrder.status || recentOrder.orderStatus || 'UNKNOWN').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Status:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        (recentOrder.paymentStatus || recentOrder.payment_status) === 'processing' 
                          ? 'bg-blue-100 text-blue-800' 
                          : (recentOrder.paymentStatus || recentOrder.payment_status) === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {(recentOrder.paymentStatus || recentOrder.payment_status || 'UNKNOWN').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium text-gray-900">{recentOrder.paymentMethod || recentOrder.payment_method || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Amount:</span>
                      <span className="font-bold text-green-600">
                        ${(recentOrder.totalAmount || recentOrder.total_amount || recentOrder.amount || 0).toFixed(2)}
                      </span>
                    </div>
                    {recentOrder.createdAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Created:</span>
                        <span className="font-medium text-gray-900">
                          {new Date(recentOrder.createdAt || recentOrder.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <ShoppingBagIcon className="w-5 h-5" />
                    Order Items
                  </h3>
                  <div className="space-y-3">
                    {(recentOrder.items || recentOrder.orderItems || []).map((item: any, index: number) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <ShoppingBagIcon className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {item.productName || item.product_name || item.name || 'Product'}
                          </p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity || 1} × ${(item.price || item.unitPrice || 0).toFixed(2)}
                            {item.selectedColor && ` • ${item.selectedColor}`}
                            {item.selectedSize && ` • Size: ${item.selectedSize}`}
                          </p>
                        </div>
                      </div>
                    ))}
                    {(!recentOrder.items || recentOrder.items.length === 0) && 
                     (!recentOrder.orderItems || recentOrder.orderItems.length === 0) && (
                      <p className="text-gray-500 text-sm">No items found in order data</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.location.href = '/orders'}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                View All Orders
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setRecentOrder(null)}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Payment;
