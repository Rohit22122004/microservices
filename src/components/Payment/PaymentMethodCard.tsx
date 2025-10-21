import React from 'react';
import { motion } from 'framer-motion';
import { TrashIcon, StarIcon } from '@heroicons/react/24/outline';
import { PaymentMethod } from '../../services/paymentService';

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  paymentMethod,
  onDelete,
  onSetDefault
}) => {
  const getCardIcon = (brand?: string) => {
    switch (brand?.toLowerCase()) {
      case 'visa':
        return '💳';
      case 'mastercard':
        return '💳';
      case 'amex':
        return '💳';
      case 'discover':
        return '💳';
      default:
        return '💳';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'card':
        return 'bg-blue-100 text-blue-800';
      case 'paypal':
        return 'bg-yellow-100 text-yellow-800';
      case 'stripe':
        return 'bg-purple-100 text-purple-800';
      case 'razorpay':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative bg-white rounded-xl p-6 border-2 transition-all ${
        paymentMethod.isDefault 
          ? 'border-blue-500 shadow-lg' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      {paymentMethod.isDefault && (
        <div className="absolute -top-2 -right-2">
          <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <StarIcon className="w-3 h-3 fill-current" />
            Default
          </div>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{getCardIcon(paymentMethod.brand)}</div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">
                {paymentMethod.brand?.toUpperCase() || paymentMethod.provider}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(paymentMethod.type)}`}>
                {paymentMethod.type.toUpperCase()}
              </span>
            </div>
            {paymentMethod.last4 && (
              <p className="text-sm text-gray-500">•••• •••• •••• {paymentMethod.last4}</p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {!paymentMethod.isDefault && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSetDefault(paymentMethod.id)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              Set Default
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(paymentMethod.id)}
            className="text-red-600 hover:text-red-700 p-1"
          >
            <TrashIcon className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {paymentMethod.expiryMonth && paymentMethod.expiryYear && (
        <div className="text-sm text-gray-500 mb-2">
          Expires {paymentMethod.expiryMonth.toString().padStart(2, '0')}/{paymentMethod.expiryYear}
        </div>
      )}

      {paymentMethod.billingAddress && (
        <div className="text-sm text-gray-500">
          {paymentMethod.billingAddress.city}, {paymentMethod.billingAddress.state}
        </div>
      )}
    </motion.div>
  );
};

export default PaymentMethodCard;
