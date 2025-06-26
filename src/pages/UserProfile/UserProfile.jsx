import React, { useContext, useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { StoreContext } from "../../context/StoreContext";
import "./UserProfile.css";
import { toast } from "react-toastify";

const UserProfile = () => {
  const { userId } = useContext(StoreContext);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    addresses: [],
  });

  const [newAddress, setNewAddress] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;

      try {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserData((prev) => ({
            ...prev,
            name: data.name || "",
            email: data.email || auth.currentUser.email,
            phone: data.phone || "",
            addresses: data.addresses || [],
          }));
        } else {
        
          await setDoc(userRef, {
            name: "",
            email: auth.currentUser.email,
            phone: "",
            addresses: [],
          });
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        toast.error("Error fetching profile");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleSave = async () => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
      });
      toast.success("Profile updated!");
    } catch (err) {
      console.error("Error saving profile:", err);
      toast.error("Failed to update profile");
    }
  };

  const handleAddAddress = async () => {
    if (!newAddress.trim()) return;
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        addresses: arrayUnion(newAddress.trim()),
      });
      setUserData((prev) => ({
        ...prev,
        addresses: [...prev.addresses, newAddress.trim()],
      }));
      setNewAddress("");
      toast.success("Address added!");
    } catch (err) {
      console.error("Error adding address:", err);
      toast.error("Failed to add address");
    }
  };

  const handleDeleteAddress = async (addr) => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        addresses: arrayRemove(addr),
      });
      setUserData((prev) => ({
        ...prev,
        addresses: prev.addresses.filter((a) => a !== addr),
      }));
      toast.success("Address removed!");
    } catch (err) {
      console.error("Error removing address:", err);
      toast.error("Failed to remove address");
    }
  };

  if (loading)
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        Loading...
      </div>
    );

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      <div className="profile-form">
        <label>Name:</label>
        <input
          type="text"
          value={userData.name}
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, name: e.target.value }))
          }
        />

        <label>Email:</label>
        <input type="email" value={userData.email} disabled />

        <label>Phone:</label>
        <input
          type="text"
          value={userData.phone}
          onChange={(e) =>
            setUserData((prev) => ({ ...prev, phone: e.target.value }))
          }
        />

        <button className="save-btn" onClick={handleSave}>
          Save Profile
        </button>
      </div>

      <div className="address-section">
        <h3>Saved Addresses</h3>
        <ul>
          {userData.addresses.map((addr, index) => (
            <li key={index}>
              {addr}
              <button className="dlt-btn" onClick={() => handleDeleteAddress(addr)}>Delete</button>
            </li>
          ))}
        </ul>

        <div className="new-address">
          <input
            type="text"
            value={newAddress}
            placeholder="Add New Address"
            onChange={(e) => setNewAddress(e.target.value)}
          />
          <button onClick={handleAddAddress}>Add Address</button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
