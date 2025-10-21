import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { StarIcon, HandThumbUpIcon, HandThumbDownIcon, ChatBubbleLeftIcon, FlagIcon, CalendarIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Review } from '../../services/reviewService';

interface ReviewCardProps {
  review: Review;
  onHelpful: (reviewId: string, helpful: boolean) => void;
  onReply: (reviewId: string) => void;
  onReport: (reviewId: string) => void;
  showActions?: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onHelpful,
  onReply,
  onReport,
  showActions = true
}) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [userVote, setUserVote] = useState<'helpful' | 'not_helpful' | null>(null);

  const handleHelpfulClick = (helpful: boolean) => {
    if (userVote === (helpful ? 'helpful' : 'not_helpful')) {
      return; // Already voted
    }
    setUserVote(helpful ? 'helpful' : 'not_helpful');
    onHelpful(review.id, helpful);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const shouldTruncate = review.content.length > 200;
  const displayContent = shouldTruncate && !showFullContent 
    ? review.content.substring(0, 200) + '...' 
    : review.content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {review.userAvatar ? (
            <img
              src={review.userAvatar}
              alt={review.userName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-medium text-sm">
                {review.userName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-gray-900">{review.userName}</h4>
              {review.verified && (
                <div className="flex items-center gap-1 text-green-600 text-sm">
                  <CheckCircleIcon className="w-4 h-4" />
                  <span>Verified Purchase</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CalendarIcon className="w-4 h-4" />
              {new Date(review.createdAt).toLocaleDateString()}
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              {renderStars(review.rating)}
            </div>
            <span className="text-sm font-medium text-gray-700">
              {review.rating}/5
            </span>
          </div>

          {review.title && (
            <h5 className="font-medium text-gray-900 mb-2">{review.title}</h5>
          )}

          <p className="text-gray-700 mb-3 leading-relaxed">
            {displayContent}
            {shouldTruncate && (
              <button
                onClick={() => setShowFullContent(!showFullContent)}
                className="text-blue-600 hover:text-blue-700 ml-2 text-sm font-medium"
              >
                {showFullContent ? 'Show less' : 'Read more'}
              </button>
            )}
          </p>

          {review.images && review.images.length > 0 && (
            <div className="flex gap-2 mb-4 overflow-x-auto">
              {review.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Review image ${index + 1}`}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                />
              ))}
            </div>
          )}

          {showActions && (
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleHelpfulClick(true)}
                  className={`flex items-center gap-1 text-sm transition-colors ${
                    userVote === 'helpful'
                      ? 'text-green-600'
                      : 'text-gray-500 hover:text-green-600'
                  }`}
                >
                  <HandThumbUpIcon className="w-4 h-4" />
                  <span>Helpful ({review.helpful})</span>
                </button>

                <button
                  onClick={() => handleHelpfulClick(false)}
                  className={`flex items-center gap-1 text-sm transition-colors ${
                    userVote === 'not_helpful'
                      ? 'text-red-600'
                      : 'text-gray-500 hover:text-red-600'
                  }`}
                >
                  <HandThumbDownIcon className="w-4 h-4" />
                  <span>Not helpful ({review.notHelpful})</span>
                </button>

                <button
                  onClick={() => onReply(review.id)}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                >
                  <ChatBubbleLeftIcon className="w-4 h-4" />
                  <span>Reply</span>
                </button>
              </div>

              <button
                onClick={() => onReport(review.id)}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-600 transition-colors"
              >
                <FlagIcon className="w-4 h-4" />
                <span>Report</span>
              </button>
            </div>
          )}

          {review.replies && review.replies.length > 0 && (
            <div className="mt-4 space-y-3">
              {review.replies.map((reply) => (
                <div key={reply.id} className="bg-gray-50 rounded-lg p-4 ml-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-900">{reply.userName}</span>
                    {reply.isVendor && (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        Vendor
                      </span>
                    )}
                    <span className="text-sm text-gray-500">
                      {new Date(reply.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 text-sm">{reply.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ReviewCard;
