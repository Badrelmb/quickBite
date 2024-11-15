import React from 'react';
import './Header.css'; // Import any necessary CSS for the header
import logo from './logo_transparent.png'; 

function Header({ userID, onLogout }) {
  return (
    <header className="header">
      <img src={logo} alt="QuickBite Logo" className="logo" />
      <div className="user-section">
        <div className="user-id">{userID}</div>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>
    </header>
  );
}

export default Header;