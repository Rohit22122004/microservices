import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FunnelIcon, Squares2X2Icon, ListBulletIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/Products/ProductCard';
import { useStore, Product } from '../store/useStore';

const Products: React.FC = () => {
  const { filteredProducts, setProducts, filterProducts } = useStore();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('name');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });

  // Fetch products from backend
  useEffect(() => {
    fetch('http://localhost:8082/api/products')
      .then((res) => res.json())
      .then((data: Product[]) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error('Failed to fetch products:', error);
      });
  }, [setProducts]);

  const categories = ['All', 'Electronics', 'Fashion', 'Home & Garden', 'Sports'];

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category === 'All' ? '' : category);
    filterProducts(category === 'All' ? undefined : category, priceRange.min, priceRange.max);
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange({ min, max });
    filterProducts(selectedCategory || undefined, min, max);
  };

  return (
    <div className="min-h-screen pt-20 brand-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Our Products</h1>
              <p className="text-lg text-gray-600">Discover our curated collection of premium products</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/add-product')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-full text-white btn-brand shadow-lg hover:shadow-xl"
            >
              <PlusIcon className="h-5 w-5 animate-bounce-slow" />
              <span>Add Product</span>
            </motion.button>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-72 space-y-6"
          >
            {/* Price Range Card */}
            <div className="soft-card rounded-3xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-800">Price Range</h3>
                <button type="button" className="text-[12px] text-[var(--brand-2)]">Reset</button>
              </div>
              {/* Decorative range chart */}
              <div className="h-20 w-full rounded-2xl bg-[rgba(24,154,180,0.08)] relative overflow-hidden mb-4">
                <div className="absolute inset-x-6 bottom-6 h-2 rounded-full" style={{ background: 'linear-gradient(90deg, var(--brand-3), var(--brand-2))' }} />
                <div className="absolute left-8 -top-4 w-36 h-36 bg-[rgba(117,230,218,0.25)] rounded-full blur-2xl" />
                <div className="absolute right-10 -bottom-6 w-40 h-32 bg-[rgba(24,154,180,0.22)] rounded-full blur-2xl" />
                {/* Knobs */}
                <div className="absolute left-6 bottom-5 h-8 px-3 rounded-full bg-black/80 text-white text-xs flex items-center">$20</div>
                <div className="absolute right-6 bottom-5 h-8 px-3 rounded-full bg-black/80 text-white text-xs flex items-center">$1130</div>
              </div>
              <p className="text-[12px] text-gray-500">The average price is $300</p>
            </div>

            {/* Star Rating Card */}
            <div className="soft-card rounded-3xl p-5">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Star Rating</h3>
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {[1,2,3,4,5].map((i) => (
                    <svg key={i} className={`h-5 w-5 ${i <= 4 ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-gray-500">4 Stars & up</span>
              </div>
            </div>

            {/* Brand Card */}
            <div className="soft-card rounded-3xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-800">Brand</h3>
                <button type="button" className="text-[12px] text-[var(--brand-2)]">Reset</button>
              </div>
              <ul className="space-y-3">
                {['Adidas','Columbia','Demix','New Balance','Nike','Xiaomi','Asics'].map((b) => (
                  <li key={b} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-[var(--brand-4)] flex items-center justify-center text-[10px] text-gray-600">{b[0]}</div>
                      <span className="text-sm text-gray-700">{b}</span>
                    </div>
                    <span className="inline-flex h-5 w-5 rounded-lg" style={{ background: 'linear-gradient(135deg, var(--brand-2), var(--brand-3))' }} />
                  </li>
                ))}
              </ul>
              <button type="button" className="mt-3 text-[12px] text-[var(--brand-2)]">More Brand</button>
            </div>
          </motion.aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Toolbar */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="soft-card p-4 rounded-2xl mb-6 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">{filteredProducts.length} products found</span>
              </div>
              <div className="flex items-center space-x-4">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[var(--brand-2)] focus:border-transparent">
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Rating</option>
                </select>
                {/* View Mode buttons here */}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {filteredProducts.map((product, index) => (
                <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>

            {filteredProducts.length === 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
