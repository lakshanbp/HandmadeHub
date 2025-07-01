import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => (
  <footer className="footer">
    <div className="footer-content">
      <div className="footer-col">
        <div className="footer-title">SHOP</div>
        <a href="/our-story" className="footer-link">Our Story</a>
        <a href="/gift-card" className="footer-link">Gift Card</a>
      </div>
      <div className="footer-col">
        <div className="footer-title">HELPFUL LINKS</div>
        <Link to="/contact" className="footer-link">Contact Us</Link>
        <a href="/faq" className="footer-link">FAQ</a>
        <Link to="/track-order" className="footer-link">Track Order</Link>
      </div>
      <div className="footer-col contact-us">
        <div className="footer-title">CONTACT US</div>
        <div className="footer-contact">3-1-19 Benten, Chuo-ku,<br/>Niigata City, Niigata Prefecture, Japan 950-0901<br/>025-247-6300<br/>info@mysite.com</div>
        <div className="footer-social">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">{FaFacebook({ size: 22 })}</a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">{FaTwitter({ size: 22 })}</a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">{FaInstagram({ size: 22 })}</a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">{FaLinkedin({ size: 22 })}</a>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <div>© 2025 Handmade Hub. All rights reserved.</div>
      
    </div>
  </footer>
);

export default Footer; 