import React from 'react';
import './Footer.css';
import { assets } from '../../assets/assets';

const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className="footer-content">
            <div className="footer-content-left">
                <img src={assets.logo} alt="FoodRush" />
                <p>At FoodRush, we believe great food should be just a tap away. Whether you're craving comfort food or exploring new flavors, we bring your favorite meals straight to your doorstep — fast, fresh and fuss-free.</p>
                <div className="footer-social-icons">
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                        <img src={assets.facebook_icon} alt="Meta" />
                    </a>
                    <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                        <img src={assets.twitter_icon} alt="X" />
                    </a>
                    <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                        <img src={assets.linkedin_icon} alt="LinkedIn" />
                    </a>
                </div>
            </div>
            <div className="footer-content-center">
                <h2>COMPANY</h2>
                <ul>
                    <li>Home</li>
                    <li>About Us</li>
                    <li>Delivery</li>
                    <li>Privacy Policy</li>
                </ul>
            </div>
            <div className="footer-content-right">
                <h2>GET IN TOUCH</h2>
                <ul>
                    <li><a href="tel:+919999999999">+91-9999999999</a></li>
                    <li><a href="mailto:foodrush@gmail.com">foodrush@gmail.com</a></li>
                </ul>
            </div>
        </div>
        <hr/>
        <p className="footer-copyright"> Copyright 2025 © FoodRush.com - All Right Reserved.</p>
    </div>
  )
}

export default Footer;
