import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon, SparklesIcon, CubeIcon, ShieldCheckIcon, PlusIcon } from '@heroicons/react/24/outline';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: CubeIcon,
      title: '3D Product Views',
      description: 'Explore products in stunning 3D detail with interactive rotation and zoom.'
    },
    {
      icon: SparklesIcon,
      title: 'Smooth Animations',
      description: 'Experience fluid transitions and delightful micro-interactions throughout.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure Shopping',
      description: 'Shop with confidence using our secure payment and data protection.'
    }
  ];

  const categories = [
    { name: 'Electronics', image: '/api/placeholder/300/200', count: '2,500+' },
    { name: 'Fashion', image: '/api/placeholder/300/200', count: '5,200+' },
    { name: 'Home & Garden', image: '/api/placeholder/300/200', count: '1,800+' },
    { name: 'Sports', image: '/api/placeholder/300/200', count: '3,100+' },
  ];

  return (
    <div className="min-h-screen pt-16 bg-[#faf7ff]">
      {/* New Hero Section (flat template, no 3D) */}
      <section className="relative">
        {/* subtle page grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(120, 90, 200, 0.12) 1px, transparent 0)",
            backgroundSize: "40px 40px",
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.4) 25%, rgba(0,0,0,0.7))",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10 text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="uppercase tracking-[0.2em] text-xs text-[#7d72b2] mb-4"
          >
            Professional Services
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[42px] md:text-[64px] leading-tight font-extrabold font-serif text-[#4b3f72]"
          >
            Realize your workflow goals
            <br className="hidden md:block" />
            faster
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 max-w-2xl mx-auto text-[#6b6a7a]"
          >
            Our team is with you every step of the way. When you need
            additional support, our services team is here to accelerate and increase
            the value you get.
          </motion.p>

          {/* Brand strip placeholders (no names) */}
          <div className="mt-8 flex items-center justify-center gap-10 opacity-70">
            <div className="h-6 w-20 rounded bg-[#e8e4f4]" />
            <div className="h-6 w-24 rounded bg-[#e8e4f4]" />
            <div className="h-6 w-20 rounded bg-[#e8e4f4]" />
          </div>

          {/* Buttons (unchanged behavior/labels) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/products')}
              className="px-8 py-4 bg-[#4b3f72] text-white rounded-full font-semibold text-lg shadow-sm hover:shadow transition"
            >
              <span>Explore Products</span>
              <ArrowRightIcon className="h-5 w-5 inline ml-2" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/add-product')}
              className="px-8 py-4 border border-[#d9d5ec] text-[#4b3f72] bg-white rounded-full font-semibold text-lg hover:bg-[#f6f3ff] transition flex items-center space-x-2"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Add Product</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/orders')}
              className="px-8 py-4 bg-[#6e5cb3] text-white rounded-full font-semibold text-lg hover:shadow transition"
            >
              My Orders
            </motion.button>
          </motion.div>
        </div>

        {/* Layered illustration style base (no 3D, soft pastel with outlines) */}
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <div className="relative mx-auto w-full h-[22rem] md:h-[26rem]">
            {/* base platform */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[92%] h-24 rounded-[32px] bg-[#e9e3fb] border border-[#d9d1f3]" />
            {/* mid platforms */}
            <div className="absolute left-6 md:left-10 bottom-14 w-[38%] h-16 rounded-[28px] bg-[#e0f5ea] border border-[#c9eadb]" />
            <div className="absolute right-6 md:right-10 bottom-16 w-[34%] h-14 rounded-[28px] bg-[#efeafb] border border-[#e2dbf7]" />
            {/* small risers */}
            <div className="absolute left-[20%] bottom-28 w-24 h-10 rounded-2xl bg-white border border-[#e5def7]" />
            <div className="absolute right-[22%] bottom-28 w-28 h-10 rounded-2xl bg-white border border-[#e5def7]" />
            {/* center plinth */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-24 w-40 h-12 rounded-[24px] bg-white border border-[#e5def7]" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-white via-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're revolutionizing online shopping with cutting-edge technology 
              and user-centered design.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -10, scale: 1.02, rotate: 2 }}
                className="text-center p-8 rounded-2xl bg-gradient-to-br from-white via-blue-50 to-purple-50 shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50"
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 rounded-2xl flex items-center justify-center animate-pulse-slow">
                  <feature.icon className="h-8 w-8 text-white animate-bounce-slow" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600">
              Discover thousands of products across all categories
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5, rotate: 1 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <div className="aspect-w-16 aspect-h-10 bg-gradient-to-br from-primary-100 to-secondary-100">
                    <div className="flex items-center justify-center">
                      <div className="w-20 h-20 bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 rounded-2xl flex items-center justify-center animate-pulse-slow">
                        <span className="text-2xl font-bold text-white animate-bounce-slow">
                          {category.name[0]}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {category.name}
                    </h3>
                    <p className="text-gray-600">
                      {category.count} products
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-500 animate-gradient-x">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Start Shopping?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have discovered 
              the future of online shopping.
            </p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(255, 255, 255, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-primary-600 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 mx-auto animate-bounce-slow"
            >
              <span>Get Started Now</span>
              <ArrowRightIcon className="h-5 w-5" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
