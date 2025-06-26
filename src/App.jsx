import React, { useState, useContext } from "react";
import Navbar from "./components/Navbar/Navbar";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Cart from "./pages/Cart/Cart";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Footer from "./components/Footer/Footer";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import UserProfile from "./pages/UserProfile/UserProfile";
import Orders from "./pages/Orders/Orders";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { StoreContext } from "./context/StoreContext";
import Payment from "./pages/Payment/Payment";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); 
  const { loading } = useContext(StoreContext);

  if (loading)
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        Loading...
      </div>
    );

  return (
    <>
      {!loading && showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="app">
        <Navbar setShowLogin={setShowLogin} setSearchTerm={setSearchTerm} />
        <Routes>
          <Route path="/" element={<Home searchTerm={searchTerm} />} />

          <Route
            path="/cart"
            element={
              <ProtectedRoute setShowLogin={setShowLogin}>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/order"
            element={
              <ProtectedRoute setShowLogin={setShowLogin}>
                <PlaceOrder />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute setShowLogin={setShowLogin}>
                <Orders />
              </ProtectedRoute>
            }
          />

          <Route path="/profile" element={<UserProfile />} />

          <Route
            path="/payment"
            element={
              <ProtectedRoute setShowLogin={setShowLogin}>
                <Payment />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
