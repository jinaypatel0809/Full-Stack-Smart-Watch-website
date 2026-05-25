import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import CartDrawer from "./components/CartDrawer";
import Home from "./pages/Home";
import Watches from "./pages/Watches";
import SmartWatches from "./pages/SmartWatches";
import VYB from "./pages/VYB";
import Sale from "./pages/Sale";
import Gifting from "./pages/Gifting";
import Accessories from "./pages/Accessories";
import More from "./pages/More";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AdminLogin from "./pages/AdminLogin";
import AdminSignup from "./pages/AdminSignup";
import AdminDashboard from "./pages/AdminDashboard";
import ProductDetail from "./pages/ProductDetail";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-white font-sans">
            <Navbar />
            <CartDrawer />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/watches" element={<Watches />} />
              <Route path="/smart-watches" element={<SmartWatches />} />
              <Route path="/vyb" element={<VYB />} />
              <Route path="/sale" element={<Sale />} />
              <Route path="/gifting" element={<Gifting />} />
              <Route path="/accessories" element={<Accessories />} />
              <Route path="/more" element={<More />} />
              {/* Product Detail */}
              <Route path="/product/:id" element={<ProductDetail />} />
              {/* User Auth */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              {/* Admin Auth */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/signup" element={<AdminSignup />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Routes>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}