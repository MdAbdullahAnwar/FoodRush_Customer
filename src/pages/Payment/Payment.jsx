import React, { useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import "./Payment.css";

const Payment = () => {
  const { state } = useLocation();
  const { name, email, phone, orderId, amount } = state || {};
  const { userId, clearCart } = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!name || !email || !phone || !orderId || !amount) {
      toast.error("Missing order information");
      navigate("/orders");
      return;
    }

    const loadRazorpay = () => {
      return new Promise((resolve) => {
        if (window.Razorpay) {
          resolve(true);
          return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    const initializePayment = async () => {
      try {
        const isRazorpayLoaded = await loadRazorpay();
        if (!isRazorpayLoaded) throw new Error("Failed to load Razorpay SDK");

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: Math.round(amount * 100),
          currency: "INR",
          name: "FoodRush",
          description: `Order #${orderId}`,
          image: "/logo.png",
          handler: async function (response) {
            try {
              if (!response.razorpay_payment_id || !response.razorpay_order_id) {
                throw new Error("Incomplete payment response");
              }

              await updateDoc(doc(db, "users", userId, "orders", orderId), {
                paymentStatus: "completed",
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                status: "paid",
                paidAt: new Date().toISOString(),
              });

              let retries = 0;
              const maxRetries = 3;
              while (retries < maxRetries) {
                try {
                  await clearCart();
                  break;
                } catch (error) {
                  retries++;
                  if (retries === maxRetries) throw error;
                  await new Promise(resolve => setTimeout(resolve, 1000));
                }
              }

              localStorage.removeItem("promoCode");
              localStorage.removeItem("discount");

              navigate("/orders", {
                state: {
                  success: true,
                  orderId,
                  paymentId: response.razorpay_payment_id,
                },
                replace: true,
              });
            } catch (error) {
              navigate("/orders", { state: { error: true }, replace: true });
            }
          },
          prefill: { name, email, contact: phone },
          theme: { color: "#3399cc" },
          modal: {
            ondismiss: () => {
              toast.info("Payment cancelled");
              navigate("/orders", { replace: true });
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", (response) => {
          toast.error(`Payment failed: ${response.error.description}`);
          updateDoc(doc(db, "users", userId, "orders", orderId), {
            paymentStatus: "failed",
            error: response.error,
            status: "payment_failed",
          });
          navigate("/orders", { replace: true });
        });

        rzp.open();
      } catch (error) {
        console.error("Payment error:", error);
        toast.error(error.message || "Payment initialization failed");
        navigate("/orders", { replace: true });
      }
    };

    initializePayment();

    return () => {
      const razorpayScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );
      if (razorpayScript) document.body.removeChild(razorpayScript);
    };
  }, [name, email, phone, orderId, amount, userId, navigate]);

  return (
    <div className="payment-loading">
      <div className="spinner"></div>
      <h2>Redirecting to Payment Gateway</h2>
      <p>Please wait while we connect you securely...</p>
    </div>
  );
};

export default Payment;
