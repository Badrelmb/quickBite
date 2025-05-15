import React from 'react';
import { useNavigate } from 'react-router-dom';
import './coverPage.css';
import logo from './logo_transparent.png';

const CoverPage = ({ onManagerSelect }) => {
  const navigate = useNavigate();

  const handleCustomerClick = () => {
   onManagerSelect();
    navigate('/customer-login');
  };

const handleManagerClick = () => {
  onManagerSelect();       // tells App.js to hide cover
};


  return (
   <div className="cover-container">
     <header className="main-header">
        <img src={logo} alt="QuickBite Logo" className="logo" />
      </header>
    <div className="button-row">
      <button className="cover-button manager-btn" onClick={handleManagerClick}>
        I'm a Restaurant Owner
      </button>
      <button className="cover-button customer-btn" onClick={handleCustomerClick}>
        I'm a Customer
      </button>
    </div>
  </div>
  );
};

export default CoverPage;
