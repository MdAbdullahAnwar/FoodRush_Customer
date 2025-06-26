import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const ProtectedRoute = ({ children, setShowLogin }) => {
  const { token } = useContext(StoreContext);

  if (!token) {
    setShowLogin(true);
    return <Navigate to="/" />; 
  }

  return children;
};

export default ProtectedRoute;
