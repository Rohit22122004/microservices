import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShoppingCartIcon, 
  UserIcon, 
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useStore } from '../../store/useStore';

const Header: React.FC = () => {
  const { 
    cartCount, 
    isCartOpen, 
    setCartOpen, 
    isMobileMenuOpen, 
    setMobileMenuOpen,
    searchQuery,
    setSearchQuery,
    user,
    isAuthenticated
  } = useStore();

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Products', href: '/products' },
    { name: 'Track Order', href: '/tracking' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Use a 3-column grid to keep logo perfectly centered */}
        <div className="grid grid-cols-3 items-center h-16">
          {/* Left: Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -1 }}
                className="text-gray-800 hover:text-black transition-colors duration-150 font-medium"
              >
                {item.name}
              </motion.a>
            ))}
          </nav>

          {/* Center: Logo */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center"
          >
            <a href="/" className="flex items-center space-x-2 select-none">
              <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-black font-extrabold text-2xl tracking-tight">ECommerce 3D</span>
            </a>
          </motion.div>

          {/* Right: Icons and actions */}
          <div className="flex items-center justify-end space-x-3">
            {/* Hide desktop search to match minimal design; keep mobile search below */}
            <div className="hidden md:block" aria-hidden="true"></div>

            {/* User Account */}
            {isAuthenticated ? (
              <motion.a
                href="/profile"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-800 hover:text-black transition-colors duration-150"
              >
                <div className="flex flex-col space-y-2">
                  <img
                    src={user?.avatar || '/api/placeholder/32/32'}
                    alt={user?.name || 'User'}
                    className="w-8 h-8 rounded-full border border-gray-200"
                  />
                </div>
              </motion.a>
            ) : (
              <motion.a
                href="/login"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-800 hover:text-black transition-colors duration-150"
                aria-label="Login"
                title="Login"
              >
                <UserIcon className="h-6 w-6" />
              </motion.a>
            )}

            {/* Shopping Cart */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCartOpen(!isCartOpen)}
              className="relative p-2 text-gray-800 hover:text-black transition-colors duration-150"
              aria-label="Open cart"
              title="Cart"
            >
              <ShoppingCartIcon className="h-6 w-6" />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
                >
                  {cartCount}
                </motion.span>
              )}
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-800 hover:text-black transition-colors duration-150"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{ 
            height: isMobileMenuOpen ? 'auto' : 0,
            opacity: isMobileMenuOpen ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-4">
            {/* Mobile Search */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-200 rounded-full text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-2">
              {navItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  whileHover={{ x: 10 }}
                  className="block py-2 text-gray-800 hover:text-black transition-colors duration-150 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </motion.a>
              ))}
            </nav>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;
