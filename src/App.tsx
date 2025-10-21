import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useStore } from './store/useStore';
import { Toaster } from 'react-hot-toast';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import Cart from './components/Cart/Cart';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Tracking from './pages/Tracking';
import AddProduct from './pages/AddProduct'; 
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import PaymentProcessing from './pages/PaymentProcessing';
import PaymentSuccess from './pages/PaymentSuccess';
import ShippingProcessing from './pages/ShippingProcessing';
import OrderSuccess from './pages/OrderSuccess';
import OrdersPage from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';
import AdminShipping from './pages/AdminShipping';

function App() {
  const RequireAuth: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const token = localStorage.getItem('token');
    const { user } = useStore();
    const location = useLocation();
    if (!token && !user) {
      return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }
    return children;
  };

  const RequireAdmin: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const token = localStorage.getItem('token');
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const location = useLocation();
    if (!token || !isAdmin) {
      return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }
    return children;
  };

  const AppContent: React.FC = () => {
    const location = useLocation();
    const hideChrome = location.pathname === '/login' || location.pathname === '/register';

    return (
      <div className="App min-h-screen flex flex-col">
        {!hideChrome && <Header />}
        {!hideChrome && <Cart />}

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<RequireAuth><Home /></RequireAuth>} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/add-product" element={<RequireAuth><AddProduct /></RequireAuth>} /> {/* AddProduct route */}
            <Route path="/checkout" element={<RequireAuth><Checkout /></RequireAuth>} />
            <Route path="/payment" element={<RequireAuth><Payment /></RequireAuth>} />
            <Route path="/payment/processing" element={<RequireAuth><PaymentProcessing /></RequireAuth>} />
            <Route path="/payment/success" element={<RequireAuth><PaymentSuccess /></RequireAuth>} />
            <Route path="/shipping/processing" element={<RequireAuth><ShippingProcessing /></RequireAuth>} />
            <Route path="/order/success" element={<RequireAuth><OrderSuccess /></RequireAuth>} />
            <Route path="/orders" element={<RequireAuth><OrdersPage /></RequireAuth>} />
            <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
            <Route path="/admin/shipping" element={<RequireAdmin><AdminShipping /></RequireAdmin>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
            <Route path="/tracking" element={<Tracking />} />
          </Routes>
        </main>

        {!hideChrome && <Footer />}

        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    );
  };

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;


