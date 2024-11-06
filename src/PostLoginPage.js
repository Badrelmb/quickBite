import React from 'react';
import './PostLoginPage.css';  // Import the CSS for the PostLoginPage
import logo from './logo_transparent.png';  // Import the logo image
import { useNavigate } from 'react-router-dom';


function PostLoginPage() {
  const userID = 'USER123'; // You can dynamically set this from your login data
 const navigate = useNavigate(); // React Router's hook to navigate programmatically

  // Define the handleLogout function
  const handleLogout = () => {
    // Here, you can add logic to clear authentication/session, etc.
    console.log("Logging out...");

    // For now, just navigate back to the main page (login page)
    navigate('/');
  };
// Navigate to the restaurant registration page
  const goToRegisterMyRestaurant = () => {
    navigate('/register-restaurant');
  };

  return (
    <div className="post-login-page">
      {/* Header */}
      <header className="post-login-header">
        <img src={logo} alt="QuickBite Logo" className="logo" />
         <div className="user-section">
    <div className="user-id">{userID}</div>
    <button className="logout-btn" onClick={handleLogout}>Logout</button>
  </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <h1>Welcome, {userID}!</h1>
        <p>Let's get started by registering your restaurant.</p>
        <button className="register-restaurant-btn"  onClick={goToRegisterMyRestaurant}>Register My Restaurant</button>
      </main>

      {/* Footer */}
      <footer className="post-login-footer">
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

export default PostLoginPage;
