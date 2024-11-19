import React from 'react';
import './restaurantManagementPage.css'; // Import minimal custom CSS
import Header from './Header'; // Import the shared Header component
import logo from './logo_transparent.png'; 
import restaurantlogo from './the-red-cafe.png';
import { useNavigate } from 'react-router-dom';

function RestaurantManagementPage() {
  console.log("Rendering Restaurant Management Page");
  const restaurantName = "Your Restaurant Name";
  const navigate = useNavigate();
  const userID = 'USER123';

  // Define the handleLogout function
  const handleLogout = () => {
    navigate('/'); // Redirect to the home or login page
  };

  // Navigation functions
  const goToTableManagement = () => navigate('/table-management');
  const goToMenuManagement = () => navigate('/menu-management');
  const goToOrders = () => navigate('/orders');
  const goToData = () => navigate('/sales-data');

  const goToEditProfile = () => navigate('/edit-restaurant-profile');

  return (
    
    <div className="">

    <header className="register-header">
              <img src={logo} alt="QuickBite Logo" className="logo" />
              <div className="user-section">
                <div className="user-id">USER123</div>
                <button className="logout-btn">Logout</button>
              </div>
            </header>

      {/* Main Section */}
      <main className="text-center RestoManagement">
        <button className="logo-button " onClick={goToEditProfile}>
          <img src={restaurantlogo} alt="Restaurant Logo" className="rounded-circle" style={{ width: '150px',height: '150px',  }} />
        </button>
        <h1 className="">The Red Cafe</h1>
        <div className="row g-3">
          <div className="col-6">
            <button className="btn btn-primary w-50 custom-button" onClick={goToTableManagement}>Table Management</button>
          </div>
          <div className="col-6">
            <button className="btn btn-primary w-50 custom-button" onClick={goToMenuManagement}>Menu Management</button>
          </div>
          <div className="col-6">
            <button className="btn btn-primary w-50 custom-button" onClick={goToOrders}>Orders</button>
          </div>
          <div className="col-6">
            <button className="btn btn-primary w-50 custom-button" onClick={goToData}>Sales Data</button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer>
        <p>Support available Mon to Fri 9am ~ 5pm</p>
        <span>📞 02-1234-5678</span>
        <p>© 2024 QuickBite</p>
      </footer>
    </div>
  );
}

export default RestaurantManagementPage;
