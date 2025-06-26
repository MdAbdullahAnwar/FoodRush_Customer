import React, { useContext, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

const Navbar = ({ setShowLogin, setSearchTerm }) => {
  const [menu, setMenu] = useState("menu");
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    setSearchTerm(value);
  };

  const logout = async () => {
    await signOut(auth);
    setToken("");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="navbar">
      <Link to="/">
        <img src={assets.logo} alt="FoodRush" className="logo" />
      </Link>
      <ul className="navbar-menu">
        <Link
          to="/"
          onClick={() => setMenu("home")}
          className={menu === "home" ? "active" : ""}
        >
          Home
        </Link>
        <a
          href="#explore-menu"
          onClick={() => setMenu("menu")}
          className={menu === "menu" ? "active" : ""}
        >
          Menu
        </a>
        <a
          href="#app-download"
          onClick={() => setMenu("mobile-app")}
          className={menu === "mobile-app" ? "active" : ""}
        >
          Mobile-App
        </a>
        <a
          href="#footer"
          onClick={() => setMenu("contact-us")}
          className={menu === "contact-us" ? "active" : ""}
        >
          Contact Us
        </a>
      </ul>
      <div className="navbar-right">
        <div className="input-wrapper">
          <img
            src={assets.search_icon}
            alt="Search Icon"
            className="search-icon"
          />
          <input
            type="text"
            placeholder="Search Food..."
            value={searchValue}
            onChange={handleSearch}
            className="navbar-search-input"
          />
        </div>

        <div className="navbar-search-icon">
          {token ? (
            <Link to="/cart">
              <img src={assets.basket_icon} alt="Cart" />
            </Link>
          ) : (
            <img
              src={assets.basket_icon}
              alt="Cart"
              onClick={() => setShowLogin(true)}
              style={{ cursor: "pointer" }}
            />
          )}
          <div className={getTotalCartAmount() === 0 ? "" : "dot"}></div>
        </div>
        {!token ? (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} alt="Profile" />
            <ul className="nav-profile-dropdown">
              <li onClick={() => navigate("/profile")}>
                <img src={assets.profile_image} alt="Profile" />
                <p>UpdateProfile</p>
              </li>
              <hr/>
              <li onClick={() => navigate("/orders")}>
                <img src={assets.bag_icon} alt="Bag" />
                <p>Orders</p>
              </li>
              <hr />
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="Logout" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
