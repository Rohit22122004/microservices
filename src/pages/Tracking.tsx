import React from 'react';
import { motion } from 'framer-motion';
import ShippingTracker from '../components/Shipping/ShippingTracker';

const Tracking: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 pt-20 animate-gradient-xy">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Track Your Package</h1>
          <p className="text-gray-600">
            Enter your tracking number below to get real-time updates on your shipment.
          </p>
        </motion.div>

        <ShippingTracker />
      </div>
    </div>
  );
};

export default Tracking;
