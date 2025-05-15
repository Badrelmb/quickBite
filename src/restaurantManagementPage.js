import React, { useEffect, useState } from 'react';
import './restaurantManagementPage.css';
import logo from './logo_transparent.png';
import defaultLogo from './img/default-restaurant-logo.png'; // <-- Add your default image file
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient'; // Adjust path as needed

function RestaurantManagementPage() {
  const [ownerID, setOwnerID] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const navigate = useNavigate();

  // Logout handler
  const handleLogout = () => {
    navigate('/');
  };

  // Navigation buttons
  const goToTableManagement = () => {
  navigate('/table-management', { state: { selectedRestaurant } });
};
  const goToMenuManagement = () => {
  navigate('/menu-management', { state: { selectedRestaurant } });
};
  const goToOrders = () => navigate('/orders');
  const goToData = () => navigate('/sales-data');
  const goToEditProfile = () => navigate('/edit-restaurant-profile');

useEffect(() => {
  const fetchRestaurants = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      console.error('User not authenticated:', error);
      navigate('/');
      return;
    }

    const { data: ownerData, error: ownerError } = await supabase
      .from('restaurant_owners')
      .select('owner_id')
      .eq('user_id', user.id)
      .single();

    if (ownerError || !ownerData) {
      console.error("Owner data not found", ownerError);
      navigate('/');
      return;
    }

    setOwnerID(ownerData.owner_id); // ✅ Display user-id in header

    const { data: restaurantsData, error: restaurantError } = await supabase
      .from('restaurants')
      .select('*')
      .eq('owner_id', ownerData.owner_id);

    if (restaurantError) {
      console.error("Error fetching restaurants:", restaurantError);
      return;
    }

    setRestaurants(restaurantsData); // ✅ Store restaurants
    setSelectedRestaurant(restaurantsData[0] || null); // ✅ Auto-select first one if exists
  };

  fetchRestaurants();
}, []);


  return (
    <div className="">
      <header className="register-header">
        <img src={logo} alt="QuickBite Logo" className="logo" />
        <div className="user-section">
          <div className="user-id">{ownerID || 'Loading...'}</div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="text-center RestoManagement">
        {/* Restaurant Selection Area */}
        <button className="btn btn-outline-primary mb-3" onClick={() => navigate('/register-restaurant')}>
  + Add Restaurant
</button>
        <div className="restaurant-selection">
          {restaurants.map((rest) => (
            <button
              key={rest.id}
              className={`restaurant-logo-btn ${selectedRestaurant?.id === rest.id ? 'selected' : ''}`}
              onClick={() => setSelectedRestaurant(rest)}
            >
              <img
                src={rest.logo_url || defaultLogo}
                alt={rest.name}
                className="rounded-circle"
                style={{ width: '100px', height: '100px' }}
              />
            </button>
          ))}
        </div>

        {/* Selected Restaurant Info */}
        {selectedRestaurant && (
          <>
            <h1 className="mt-3">{selectedRestaurant.name}</h1>
            <div className="row g-3 mt-3">
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
          </>
        )}
      </main>

      <footer>
        <p>Support available Mon to Fri 9am ~ 5pm</p>
        <span>📞 02-1234-5678</span>
        <p>© 2024 QuickBite</p>
      </footer>
    </div>
  );
}

export default RestaurantManagementPage;
