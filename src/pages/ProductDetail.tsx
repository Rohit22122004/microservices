import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore, Product } from '../store/useStore';
import toast from 'react-hot-toast';
import ReviewCard from '../components/Reviews/ReviewCard';
import ReviewForm from '../components/Reviews/ReviewForm';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart, user } = useStore();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch(`http://localhost:8082/api/products/${id}`)
      .then((res) => res.json())
      .then((data: Product) => {
        setProduct(data);
      })
      .catch((error) => {
        console.error('Failed to fetch product details:', error);
        toast.error('Failed to load product details');
      });
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, 1, '', '');
      toast.success('Added to cart!');
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p>{product.description}</p>
          <p className="text-xl font-semibold">${product.price.toFixed(2)}</p>
          <button
            onClick={handleAddToCart}
            className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
          >
            Add to Cart
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetail;
