import React, { useState } from 'react';
import './RegisterMyRestaurant.css';  // Import the CSS file
import logo from './logo_transparent.png';  // Assuming logo image
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function RegisterMyRestaurant() {
  const [step, setStep] = useState(1); // Track current step (1 or 2)
  const [progress, setProgress] = useState(50); // Progress bar percentage
  const userID = 'USER123'; // Example user ID, can be dynamically set
  const navigate = useNavigate(); // React Router's hook to navigate programmatically

  const nextStep = () => {
    setStep(step + 1);
    setProgress(100);
  };

  const prevStep = () => {
    setStep(step - 1);
    setProgress(50);
  };

  // Mock handleSubmit function to simulate form submission and redirection
  const handleSubmit = (event) => {
    event.preventDefault();
    // Simulate form submission
    console.log("Form submitted");
    // Redirect to the page where the menu will be added
    navigate('/restaurant-management'); // Adjust the route path accordingly
  };
  const handleLogout = () => {
    // Clear any user session data here
    navigate('/'); // Redirect to login page
  };
  return (
    <div className="register-restaurant-page">
      {/* Header */}
      <header className="register-header">
        <img src={logo} alt="QuickBite Logo" className="logo" />
        <div className="user-section">
          <div className="user-id">{userID}</div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>
<div className="content-wrapper">
      {/* Form Steps */}
      <div className="form-container form-container d-flex flex-column align-items-center">
      {step === 1 && (
        <div className="step-1 w-100">
          <h2>Step 1: Basic Info</h2>
          <form onSubmit={nextStep}>
            <div className="form-group">
              <label htmlFor="restaurantName">Restaurant Name:</label>
              <input type="text" id="restaurantName" required />
            </div>
            <div className="form-group">
              <label htmlFor="restaurantLogo">Restaurant Logo:</label>
              <input type="file" id="restaurantLogo" accept="image/*" />
            </div>
            <div className="form-group">
              <label htmlFor="category">Category:</label>
              <select id="category" required>
                <option value="Korean">Korean</option>
                <option value="Chinese">Chinese</option>
                <option value="Japanese">Japanese</option>
                <option value="Western">Western</option>
                <option value="Cafe">Cafe</option>
              </select>
            </div>
            <div className="button-container">
              {/* Changed button type to submit */}
              <button type="submit" className="next-btn">
                Next
              </button>
            </div>
          </form>
        </div>
      )}


        {step === 2 && (
          <div className="step-2 w-100">
            <h2>Step 2: Details</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="address">Address:</label>
                <input type="text" id="address" required />
              </div>
              <div className="form-group">
                <label htmlFor="hours">Hours of Operation:</label>
                <input type="text" id="hours" placeholder="e.g. 9am - 5pm" required />
              </div>
              <div className="form-group">
                <label>Parking Available:</label>
                <div className="radio-group">
                  <input type="radio" id="parkingYes" name="parking" value="yes" />
                  <label htmlFor="parkingYes">Yes</label>
                  <input type="radio" id="parkingNo" name="parking" value="no" />
                  <label htmlFor="parkingNo">No</label>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="tables">Number of Tables:</label>
                <input type="number" id="tables" min="1" required />
              </div>
              <div className="button-group">
                <button type="button" onClick={prevStep} className="prev-btn">
                  Previous
                </button>
                <button type="submit" className="submit-btn">
                  Submit
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="register-footer">
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
    </div>
  );
}

export default RegisterMyRestaurant;
