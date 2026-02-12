import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Contact from './pages/Contact';
import FeatureDetail from './pages/FeatureDetail';
import MyReservations from './pages/MyReservations';
import AdminDashboard from './pages/AdminDashboard';
import AdminMenu from './pages/AdminMenu';

import { NotificationProvider } from './context/NotificationContext';
import NotificationModal from './components/NotificationModal';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <CartProvider>
            <div className="app">
              <Navbar />
              <NotificationModal />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/feature/:id" element={<FeatureDetail />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/my-reservations" element={<MyReservations />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/menu" element={<AdminMenu />} />
                </Routes>
              </main>
            </div>
          </CartProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
