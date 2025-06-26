import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { useLocation } from "react-router-dom";
import { db } from "../../firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { toast } from "react-toastify";
import "./Orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId, refreshCart, food_list } = useContext(StoreContext);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.success) {
      toast.success(
        `Payment completed successfully! Order ID: ${location.state.orderId}`
      );
      if (refreshCart) refreshCart();
      window.history.replaceState({}, document.title);
    } else if (location.state?.error) {
      window.history.replaceState({}, document.title);
    }
  }, [location.state, refreshCart]);

  useEffect(() => {
    if (!userId) return;

    const ordersRef = collection(db, "users", userId, "orders");
    const q = query(ordersRef, orderBy("date", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      setOrders(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const getItemDetails = (itemId) => {
    const item = food_list.find((food) => food._id === itemId);
    return item
      ? { name: item.name, price: item.price, image: item.image }
      : { name: itemId, price: 0, image: null };
  };

  const getStatusBadge = (order) => {
    const status = order.status || order.paymentStatus || "pending";
    const statusClass = {
      completed: "status-completed",
      delivered: "status-completed",
      paid: "status-completed",
      pending: "status-pending",
      failed: "status-failed",
      payment_failed: "status-failed",
      "out for delivery": "status-pending",
      "food processing": "status-pending",
    };
    return (
      <span
        className={`status-badge ${
          statusClass[status.toLowerCase()] || "status-pending"
        }`}
      >
        {status.toUpperCase()}
      </span>
    );
  };

  if (loading)
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        Loading...
      </div>
    );

  return (
    <div className="orders">
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>No orders yet.</p>
          <p>Start shopping to see your orders here!</p>
        </div>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <p>
                    <strong>Order #{order.id.slice(0, 8)}</strong>
                  </p>
                  <p className="order-date">
                    {new Date(order.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div>{getStatusBadge(order)}</div>
              </div>

              <div className="order-details">
                <div className="delivery-info">
                  <h4>Delivery Address</h4>
                  <p>
                    {order.deliveryInfo?.street}, {order.deliveryInfo?.city},{" "}
                    {order.deliveryInfo?.state} {order.deliveryInfo?.zip}
                  </p>
                </div>

                <div className="order-items">
                  <h4>Order Items</h4>
                  <ul>
                    {Object.entries(order.items || {}).map(([id, qty]) => {
                      const item = getItemDetails(id);
                      const itemTotal = item.price * qty;
                      return (
                        <li key={id}>
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="item-image"
                            />
                          )}
                          <div className="item-details">
                            <span className="item-name">{item.name}</span>
                            <div className="item-price-breakdown">
                              <span className="item-qty">{qty}</span>
                              <span className="item-multiply">×</span>
                              <span className="item-price">
                                ₹{item.price.toFixed(2)}
                              </span>
                              <span className="item-equals">=</span>
                              <span className="item-total">
                                ₹{itemTotal.toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="order-summary">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>₹{order.subtotal?.toFixed(2) || "0.00"}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="summary-row discount">
                      <span>Discount:</span>
                      <span>-₹{order.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="summary-row">
                    <span>Delivery Fee:</span>
                    <span>₹{order.deliveryFee?.toFixed(2) || "0.00"}</span>
                  </div>
                  <div className="summary-row total">
                    <span>
                      <strong>Total:</strong>
                    </span>
                    <span>
                      <strong>₹{order.total?.toFixed(2) || "0.00"}</strong>
                    </span>
                  </div>
                </div>

                {order.razorpayPaymentId && (
                  <div className="payment-info">
                    <h4>Payment Details</h4>
                    <p>
                      <strong>Payment ID:</strong> {order.razorpayPaymentId}
                    </p>
                    <p>
                      <strong>Payment Method:</strong>{" "}
                      {order.paymentMethod || "Online Payment"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
