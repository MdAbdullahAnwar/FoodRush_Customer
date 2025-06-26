import React, { useContext, useState, useEffect } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

const Cart = () => {
  const {
    cartItems,
    food_list,
    removeFromCart,
    getTotalCartAmount,
    addToCart,
    handleRemoveItem,
    loading,
  } = useContext(StoreContext);
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const savedCode = localStorage.getItem("promoCode");
    const savedDiscount = localStorage.getItem("discount");
    if (savedCode) setPromoCode(savedCode);
    if (savedDiscount) setDiscount(Number(savedDiscount));
  }, []);

  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : 2;
  const total = subtotal - discount + deliveryFee;

  const handleApplyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    let discountAmount = 0;
    let msg = "";

    if (code === "FLAT10" && subtotal >= 100) {
      discountAmount = 10;
      msg = "FLAT10 Applied: $10 discount";
    } else if (code === "FLAT25" && subtotal >= 200) {
      discountAmount = 25;
      msg = "FLAT25 Applied: $25 discount";
    } else if (code === "FLAT50" && subtotal >= 300) {
      discountAmount = 50;
      msg = "FLAT50 Applied: $50 discount";
    } else {
      msg = "Invalid code or requirements not met";
    }

    setDiscount(discountAmount);
    setMessage(msg);
    localStorage.setItem("promoCode", code);
    localStorage.setItem("discount", discountAmount);
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        Loading...
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart">
        <div className="cart-items">
          <div className="cart-items-title">
            <p>Items</p>
            <p>Title</p>
            <p>Price</p>
            <p>Quantity</p>
            <p>Total</p>
            <p>Remove</p>
          </div>
          <br />
          <hr />
          {food_list.map((item) => {
            if (cartItems[item._id] > 0) {
              return (
                <div key={item._id}>
                  <div className="cart-items-title cart-items-item">
                    <img src={item.image} alt={item.name} />
                    <p>{item.name}</p>
                    <p>${item.price}</p>
                    <div className="quantity-controls">
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="qty-btn-sub"
                      >
                        -
                      </button>
                      <span>{cartItems[item._id]}</span>
                      <button
                        onClick={() => addToCart(item._id)}
                        className="qty-btn-add"
                      >
                        +
                      </button>
                    </div>
                    <p>${item.price * cartItems[item._id]}</p>
                    <Trash2
                      onClick={() => handleRemoveItem(item._id)}
                      className="trash-icon"
                    />
                  </div>
                  <hr />
                </div>
              );
            }
            return null;
          })}
        </div>

        <div className="cart-bottom">
          <div className="cart-total">
            <h2>Cart Totals</h2>
            <div>
              <div className="cart-total-details">
                <p>Subtotal</p>
                <p>${subtotal}</p>
              </div>
              {discount > 0 && (
                <>
                  <hr />
                  <div className="cart-total-details">
                    <p>Discount</p>
                    <p>-${discount}</p>
                  </div>
                </>
              )}
              <hr />
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>${deliveryFee}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <b>Total</b>
                <b>${total}</b>
              </div>
            </div>
            <button 
              onClick={() => navigate("/order")} 
              disabled={subtotal === 0}
              className={subtotal === 0 ? "disabled-btn" : ""}
            >
              PROCEED TO CHECKOUT
            </button>
          </div>

          <div className="cart-promocode">
            <div>
              <p>If you have a Coupon Code, Enter it here</p>
              <div className="promo-codes">
                <span onClick={() => setPromoCode("FLAT10")}>FLAT10 (Min $100)</span>
                <span onClick={() => setPromoCode("FLAT25")}>FLAT25 (Min $200)</span>
                <span onClick={() => setPromoCode("FLAT50")}>FLAT50 (Min $300)</span>
              </div>
              <div className="cart-promocode-input">
                <input
                  type="text"
                  placeholder="Enter Your Coupon Code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <button onClick={handleApplyPromo}>Apply</button>
              </div>
              {message && <p className="promo-message">{message}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
