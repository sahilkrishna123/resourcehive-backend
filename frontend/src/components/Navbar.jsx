import React from 'react';
import { Link } from 'react-router-dom';
import '../components/css/Navbar.css'; // Import the CSS file

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">Resource Hive</div>
      <div className="navbar-links">
        <Link to="/about">Blog </Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </div>
    </nav>
  );
};

export default Navbar;
