import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CubeIcon, TruckIcon, MapPinIcon, ClockIcon, CheckCircleIcon, ExclamationTriangleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface ShippingTrackerProps {
  trackingNumber?: string;
  onClose?: () => void;
}

interface TrackingEvent {
  id: string;
  status: string;
  message: string;
  timestamp: string;
  location?: string;
  details?: string;
}

const ShippingTracker: React.FC<ShippingTrackerProps> = ({ trackingNumber: initialTracking, onClose }) => {
  const [trackingNumber, setTrackingNumber] = useState(initialTracking || '');
  const [trackingData, setTrackingData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialTracking) {
      handleTrack();
    }
  }, [initialTracking]);

  const handleTrack = async () => {
    if (!trackingNumber.trim()) {
      toast.error('Please enter a tracking number');
      return;
    }

    try {
      setLoading(true);
      setSearched(true);
      setError(null);
      
      const response = await fetch(`http://localhost:8085/api/shipping/shipments/tracking/${trackingNumber.trim()}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch tracking data: ${response.statusText}`);
      }

      const data = await response.json();
      setTrackingData(data);
      
      if (!data || (Array.isArray(data) && data.length === 0)) {
        toast.error('No tracking information found');
      } else {
        toast.success('Tracking information loaded');
      }
    } catch (error: any) {
      console.error('Failed to track shipment:', error);
      setError(error.message || 'Failed to track shipment');
      setTrackingData(null);
      toast.error('Failed to track shipment');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'created':
      case 'label_printed':
      case 'pending':
        return <CubeIcon className="w-5 h-5 text-blue-500" />;
      case 'picked_up':
      case 'in_transit':
      case 'shipped':
        return <TruckIcon className="w-5 h-5 text-indigo-500" />;
      case 'out_for_delivery':
        return <MapPinIcon className="w-5 h-5 text-orange-500" />;
      case 'delivered':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'exception':
      case 'returned':
      case 'cancelled':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ClockIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'created':
      case 'label_printed':
      case 'pending':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'picked_up':
      case 'in_transit':
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'out_for_delivery':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'exception':
      case 'returned':
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const content = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Track Your Package</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder="Enter tracking number"
          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          onKeyPress={(e) => e.key === 'Enter' && handleTrack()}
        />
        <motion.button
          whileHover={{ scale: 1.02, rotate: 1 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleTrack}
          disabled={loading}
          className="px-6 py-3 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-500 text-white rounded-lg hover:shadow-xl disabled:opacity-50 transition-all duration-300 flex items-center gap-2 animate-pulse-slow"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            <MagnifyingGlassIcon className="w-5 h-5" />
          )}
          Track
        </motion.button>
      </div>

      {searched && (
        <div className="space-y-4">
          {error ? (
            <div className="text-center py-8">
              <ExclamationTriangleIcon className="w-16 h-16 text-red-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading tracking information</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={handleTrack}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : trackingData ? (
            <>
              <div className="bg-gradient-to-r from-white via-blue-50 to-purple-50 rounded-lg p-4 shadow-sm border border-white/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tracking Number</span>
                  <span className="font-mono text-sm font-medium">{trackingNumber}</span>
                </div>
                {trackingData.status && (
                  <div className="mt-2">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(trackingData.status)}`}>
                      {getStatusIcon(trackingData.status)}
                      {trackingData.status.replace('_', ' ').toUpperCase()}
                    </div>
                  </div>
                )}
              </div>

              {/* Display the full API response */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Tracking Information</h3>
                <div className="bg-gradient-to-r from-white via-purple-50 to-pink-50 border border-white/50 rounded-lg p-4 shadow-sm">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap overflow-x-auto">
                    {JSON.stringify(trackingData, null, 2)}
                  </pre>
                </div>
              </div>

              {/* If the response has events array, display them nicely */}
              {Array.isArray(trackingData) && trackingData.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Tracking History</h3>
                  {trackingData.map((event: any, index: number) => (
                    <motion.div
                      key={event.id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-4 p-4 bg-gradient-to-r from-white via-blue-50 to-purple-50 border border-white/50 rounded-lg shadow-sm"
                    >
                      <div className="flex-shrink-0 mt-1">
                        {getStatusIcon(event.status || 'unknown')}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-900">{event.message || event.description || 'Status Update'}</h4>
                          <span className="text-sm text-gray-500">
                            {event.timestamp ? new Date(event.timestamp).toLocaleString() : 'Unknown time'}
                          </span>
                        </div>
                        {event.location && (
                          <p className="text-sm text-gray-600 mb-1 flex items-center gap-1">
                            <MapPinIcon className="w-4 h-4" />
                            {event.location}
                          </p>
                        )}
                        {event.details && (
                          <p className="text-sm text-gray-500">{event.details}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <CubeIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tracking information found</h3>
              <p className="text-gray-500">
                Please check your tracking number and try again, or contact the sender for more information.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (onClose) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
        >
          {content}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-white via-green-50 to-blue-50 rounded-xl p-6 shadow-lg border border-white/50">
      {content}
    </div>
  );
};

export default ShippingTracker;
