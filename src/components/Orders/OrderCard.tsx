import React from 'react';
import { motion } from 'framer-motion';
import { CubeIcon, TruckIcon, CreditCardIcon, CalendarIcon, MapPinIcon, EyeIcon } from '@heroicons/react/24/outline';
import { Order, OrderStatus } from '../../services/orderService';

interface OrderCardProps {
  order: Order;
  onViewDetails: (orderId: string) => void;
  onTrackOrder: (orderId: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onViewDetails, onTrackOrder }) => {
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
      case 'confirmed':
      case 'processing':
        return <CubeIcon className="w-4 h-4" />;
      case 'shipped':
        return <TruckIcon className="w-4 h-4" />;
      case 'delivered':
        return <MapPinIcon className="w-4 h-4" />;
      case 'cancelled':
      case 'refunded':
        return <CreditCardIcon className="w-4 h-4" />;
      default:
        return <CubeIcon className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
          <div className="flex items-center gap-2 mt-1">
            <CalendarIcon className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(order.status)}`}>
          {getStatusIcon(order.status)}
          {order.status.replace('_', ' ').toUpperCase()}
        </div>
      </div>

      <div className="space-y-3 mb-4">
        {order.items.slice(0, 2).map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <CubeIcon className="w-6 h-6 text-gray-400" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{item.productName}</p>
              <p className="text-sm text-gray-500">Qty: {item.quantity} × ${item.price}</p>
            </div>
          </div>
        ))}
        {order.items.length > 2 && (
          <p className="text-sm text-gray-500 ml-15">
            +{order.items.length - 2} more items
          </p>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div>
          <p className="text-sm text-gray-500">Total Amount</p>
          <p className="text-lg font-semibold text-gray-900">${order.totalAmount.toFixed(2)}</p>
        </div>
        <div className="flex gap-2">
          {(order.status === 'shipped' || order.status === 'delivered') && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onTrackOrder(order.id)}
              className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1"
            >
              <TruckIcon className="w-4 h-4" />
              Track
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onViewDetails(order.id)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1"
          >
            <EyeIcon className="w-4 h-4" />
            Details
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderCard;
