import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
              <p>© {new Date().getFullYear()} One Stop Solutions. All Rights Reserved.</p>
              <p>Developed & maintained by Prema Creations (Harshit Jain)</p>
        <p>
          📍 Based in India &nbsp; | &nbsp;
          📞 <a href="tel:+918355927942">+91 83559 27942</a> &nbsp; | &nbsp;
          💬 <a href="https://wa.me/918355927942" target="_blank" rel="noopener noreferrer">WhatsApp Us</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
