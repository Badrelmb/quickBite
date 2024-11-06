import React, { useState } from 'react';
import './MainPage.css'; // Custom CSS
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import 'animate.css/animate.min.css'; // Animate.css for sliding effect
import { Modal } from 'react-bootstrap'; // Bootstrap modal component
import logo from './logo_transparent.png'; // Your logo
import { useNavigate } from 'react-router-dom';


function MainPage() {
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [formType, setFormType] = useState('login'); // Track form type (login or register)

  const openForm = (type) => {
    setFormType(type); // Set form type to login or register
    setShowModal(true); // Show modal
  };

  const closeForm = () => {
    setShowModal(false); // Hide modal
  };
const navigate = useNavigate();

const handleLoginSubmit = (e) => {
  e.preventDefault();  // Prevent the form from actually submitting
  navigate('/post-login');  // Navigate to the PostLoginPage route
};
  return (
    <div className="main-page">
      <header className="main-header">
        <img src={logo} alt="QuickBite Logo" className="logo" />
      </header>

      {/* Welcome Section */}
      <div className="content">
        <div className="welcome-section">
          <h1>Welcome to QuickBite!</h1>
          <p>Manage your restaurant efficiently and enhance the dining experience for your customers.</p>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="login-btn" onClick={() => openForm('login')}>Login</button>
          <button className="register-btn" onClick={() => openForm('register')}>Register</button>
        </div>

        {/* Features Section */}
        <div className="features-section">
          <h2>Why Choose QuickBite?</h2>
          <ul>
            <li>Easily manage your menu and orders</li>
            <li>Create QR codes for seamless table ordering</li>
            <li>Receive real-time order notifications</li>
          </ul>
        </div>
      </div>

      {/* Modal for Login/Register */}
      <Modal
        show={showModal}
        onHide={closeForm}
        className="animate__animated animate__slideInRight" // Animate.css sliding effect
        centered // Centered on the screen
      >
        <Modal.Header closeButton>
          <Modal.Title>{formType === 'login' ? 'Login' : 'Register'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formType === 'login' ? (
            <form onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label htmlFor="username">User ID:</label>
                <input type="text" id="username" name="username" required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required />
              </div>
              <div className="form-group">
              <a href="">Forgot my password</a>
              </div>
              <button type="submit" className="submit-btn">Login</button>
            </form>
          ) : (
            <form>
              <div className="form-group">
                <label htmlFor="restaurant">User ID:</label>
                <input type="text" id="restaurant" name="restaurant" required />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" required />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" required />
              </div>
              <button type="submit" className="submit-btn">Register</button>
            </form>
          )}
        </Modal.Body>
      </Modal>

      {/* Footer */}
       <footer className="footer">
        <div className="support-info">
          <p>Support available<br />Mon to Fri<br />9am ~ 5pm</p>
          <span className="phone-number">
            <i className="call-icon">📞</i> 02-1234-5678
          </span>
        </div>
        <div className="copyright">
          © 2024 QuickBite
        </div>
      </footer>
    </div>
  );
}

export default MainPage;
