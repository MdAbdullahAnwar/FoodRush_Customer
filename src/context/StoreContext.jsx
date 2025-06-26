import { createContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs, doc, setDoc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const [food_list, setFoodList] = useState([]);
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchFoodItems = async () => {
    const snapshot = await getDocs(collection(db, "foods"));
    const data = snapshot.docs.map((doc) => ({ _id: doc.id, ...doc.data() }));
    setFoodList(data);
  };

  const setupCartListener = (uid) => {
    return onSnapshot(doc(db, "users", uid), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setCartItems(data.cart || {});
      } else {
        setDoc(doc(db, "users", uid), { cart: {} });
        setCartItems({});
      }
    });
  };

  const saveCart = async (cart) => {
    if (!userId) return;
    try {
      await updateDoc(doc(db, "users", userId), {
        cart: cart
      });
    } catch (error) {
      console.error("Error saving cart:", error);
      throw error;
    }
  };

  const clearCart = async () => {
    try {
      setCartItems({});
      if (userId) {
        await saveCart({});
      }
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchFoodItems();
    let unsubscribeCart = () => {};
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken();
          setToken(idToken);
          setUserId(user.uid);
          unsubscribeCart = setupCartListener(user.uid);
        } catch (error) {
          console.error("Auth state change error:", error);
        }
      } else {
        setToken("");
        setUserId(null);
        setCartItems({});
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeCart();
    };
  }, []);

  const addToCart = async (itemId) => {
    const updatedCart = {
      ...cartItems,
      [itemId]: (cartItems[itemId] || 0) + 1
    };
    setCartItems(updatedCart);
    await saveCart(updatedCart);
  };

  const removeFromCart = async (itemId) => {
    const updatedCart = { ...cartItems };
    if (updatedCart[itemId] > 1) {
      updatedCart[itemId] -= 1;
    } else {
      delete updatedCart[itemId];
    }
    setCartItems(updatedCart);
    await saveCart(updatedCart);
  };

  const handleRemoveItem = async (itemId) => {
    const updatedCart = { ...cartItems };
    delete updatedCart[itemId];
    setCartItems(updatedCart);
    await saveCart(updatedCart);
  };

  const getTotalCartAmount = () => {
    return Object.entries(cartItems).reduce((total, [id, qty]) => {
      const item = food_list.find((f) => f._id === id);
      return item ? total + item.price * qty : total;
    }, 0);
  };

  return (
    <StoreContext.Provider
      value={{
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        handleRemoveItem,
        getTotalCartAmount,
        token,
        setToken,
        userId,
        loading,
        clearCart,
      }}
    >
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
