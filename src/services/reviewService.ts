export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  images?: string[];
  verified: boolean;
  helpful: number;
  notHelpful: number;
  status: ReviewStatus;
  moderationNotes?: string;
  createdAt: string;
  updatedAt: string;
  replies?: ReviewReply[];
}

export interface ReviewReply {
  id: string;
  reviewId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  isVendor: boolean;
  createdAt: string;
}

export interface ReviewSummary {
  productId: string;
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  verifiedPurchases: number;
  recommendationPercentage: number;
}

export interface ReviewAnalytics {
  sentiment: SentimentAnalysis;
  keywords: KeywordAnalysis[];
  topics: TopicAnalysis[];
  trends: ReviewTrend[];
}

export interface SentimentAnalysis {
  overall: 'positive' | 'neutral' | 'negative';
  score: number;
  confidence: number;
  aspects: {
    quality: number;
    value: number;
    shipping: number;
    service: number;
  };
}

export interface KeywordAnalysis {
  keyword: string;
  frequency: number;
  sentiment: 'positive' | 'neutral' | 'negative';
  impact: number;
}

export interface TopicAnalysis {
  topic: string;
  mentions: number;
  averageRating: number;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface ReviewTrend {
  period: string;
  averageRating: number;
  totalReviews: number;
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface ReviewFilter {
  rating?: number[];
  verified?: boolean;
  hasImages?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
  sortBy?: 'newest' | 'oldest' | 'highest_rating' | 'lowest_rating' | 'most_helpful';
  page?: number;
  limit?: number;
}

export interface ModerationAction {
  reviewId: string;
  action: 'approve' | 'reject' | 'flag' | 'hide';
  reason?: string;
  notes?: string;
}

export enum ReviewStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  FLAGGED = 'flagged',
  HIDDEN = 'hidden'
}

export interface ReviewRecommendation {
  productId: string;
  similarProducts: Array<{
    productId: string;
    productName: string;
    similarity: number;
    averageRating: number;
  }>;
  recommendedFor: string[];
  notRecommendedFor: string[];
}

class ReviewService {
  private baseUrl = process.env.REACT_APP_REVIEW_SERVICE_URL || 'http://localhost:8086';

  async getProductReviews(productId: string, filter?: ReviewFilter): Promise<{
    reviews: Review[];
    total: number;
    summary: ReviewSummary;
  }> {
    try {
      const queryParams = new URLSearchParams();
      if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
          if (value !== undefined) {
            if (Array.isArray(value)) {
              queryParams.append(key, value.join(','));
            } else if (typeof value === 'object') {
              queryParams.append(key, JSON.stringify(value));
            } else {
              queryParams.append(key, value.toString());
            }
          }
        });
      }

      const response = await fetch(`${this.baseUrl}/products/${productId}/reviews?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch product reviews');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch product reviews:', error);
      throw error;
    }
  }

  async createReview(data: {
    productId: string;
    rating: number;
    title: string;
    content: string;
    images?: File[];
    recommend?: boolean;
  }): Promise<Review> {
    try {
      const formData = new FormData();
      formData.append('productId', data.productId);
      formData.append('rating', data.rating.toString());
      formData.append('title', data.title);
      formData.append('content', data.content);
      
      if (data.recommend !== undefined) {
        formData.append('recommend', data.recommend.toString());
      }

      if (data.images) {
        data.images.forEach((image, index) => {
          formData.append(`images[${index}]`, image);
        });
      }

      const response = await fetch(`${this.baseUrl}/reviews`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to create review');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to create review:', error);
      throw error;
    }
  }

  async updateReview(reviewId: string, data: {
    rating?: number;
    title?: string;
    content?: string;
    images?: File[];
  }): Promise<Review> {
    try {
      const formData = new FormData();
      
      if (data.rating !== undefined) {
        formData.append('rating', data.rating.toString());
      }
      if (data.title) {
        formData.append('title', data.title);
      }
      if (data.content) {
        formData.append('content', data.content);
      }
      if (data.images) {
        data.images.forEach((image, index) => {
          formData.append(`images[${index}]`, image);
        });
      }

      const response = await fetch(`${this.baseUrl}/reviews/${reviewId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to update review');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to update review:', error);
      throw error;
    }
  }

  async deleteReview(reviewId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }
    } catch (error) {
      console.error('Failed to delete review:', error);
      throw error;
    }
  }

  async markReviewHelpful(reviewId: string, helpful: boolean): Promise<{ helpful: number; notHelpful: number }> {
    try {
      const response = await fetch(`${this.baseUrl}/reviews/${reviewId}/helpful`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ helpful })
      });

      if (!response.ok) {
        throw new Error('Failed to mark review as helpful');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to mark review as helpful:', error);
      throw error;
    }
  }

  async replyToReview(reviewId: string, content: string): Promise<ReviewReply> {
    try {
      const response = await fetch(`${this.baseUrl}/reviews/${reviewId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ content })
      });

      if (!response.ok) {
        throw new Error('Failed to reply to review');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to reply to review:', error);
      throw error;
    }
  }

  async getUserReviews(userId: string, page = 1, limit = 10): Promise<{
    reviews: Review[];
    total: number;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}/reviews?page=${page}&limit=${limit}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user reviews');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch user reviews:', error);
      throw error;
    }
  }

  async getReviewAnalytics(productId: string, timeframe?: '7d' | '30d' | '90d' | '1y'): Promise<ReviewAnalytics> {
    try {
      const url = timeframe 
        ? `${this.baseUrl}/products/${productId}/analytics?timeframe=${timeframe}`
        : `${this.baseUrl}/products/${productId}/analytics`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch review analytics');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch review analytics:', error);
      throw error;
    }
  }

  async moderateReview(action: ModerationAction): Promise<Review> {
    try {
      const response = await fetch(`${this.baseUrl}/reviews/${action.reviewId}/moderate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(action)
      });

      if (!response.ok) {
        throw new Error('Failed to moderate review');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to moderate review:', error);
      throw error;
    }
  }

  async detectSpam(reviewId: string): Promise<{
    isSpam: boolean;
    confidence: number;
    reasons: string[];
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/reviews/${reviewId}/spam-check`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to check for spam');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to check for spam:', error);
      throw error;
    }
  }

  async getRecommendations(productId: string): Promise<ReviewRecommendation> {
    try {
      const response = await fetch(`${this.baseUrl}/products/${productId}/recommendations`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
      throw error;
    }
  }

  async reportReview(reviewId: string, reason: string, description?: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/reviews/${reviewId}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ reason, description })
      });

      if (!response.ok) {
        throw new Error('Failed to report review');
      }
    } catch (error) {
      console.error('Failed to report review:', error);
      throw error;
    }
  }

  async getReviewInsights(productIds: string[]): Promise<Array<{
    productId: string;
    insights: {
      strengths: string[];
      weaknesses: string[];
      suggestions: string[];
      competitorComparisons: Array<{
        competitor: string;
        advantage: string;
        disadvantage: string;
      }>;
    };
  }>> {
    try {
      const response = await fetch(`${this.baseUrl}/insights`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ productIds })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch review insights');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch review insights:', error);
      throw error;
    }
  }
}

export const reviewService = new ReviewService();
