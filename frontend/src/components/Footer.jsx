import React from 'react';
import '../components/css/Footer.css';  // Importing the CSS file for the footer

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Get the current year dynamically
  return (
    <footer>
      <p>&copy; {currentYear} ResourceHive</p>
    </footer>
  );
};

export default Footer;
