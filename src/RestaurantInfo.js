import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supabase } from './supabaseClient';
import logo from './logo_transparent.png';
import './RestaurantInfo.css'; // CSS file you'll create next

export default function RestaurantInfo() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurant = async () => {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching restaurant:', error);
      } else {
        setRestaurant(data);
      }
    };

    fetchRestaurant();
  }, [id]);

  if (!restaurant) {
    return <p className="loading-text">Loading restaurant info...</p>;
  }

  return (
    <div className="restaurant-info-page">
      {/* Header */}
      <header className="client-header">
        <div className="header-inner">
          <div className="spacer" />
          <img src={logo} alt="QuickBite Logo" className="logo" />
          <div className="spacer" />
        </div>
      </header>

      <div className="restaurant-info-container">
        <button className="back-btn" onClick={() => navigate('/client-dashboard')}>
          ⬅ Back
        </button>

        <h1>{restaurant.name}</h1>

        <img
          src={restaurant.logo_url || 'https://via.placeholder.com/300x180'}
          alt={restaurant.name}
          className="restaurant-image"
        />

        <p><strong>Category:</strong> {restaurant.category}</p>
        <p><strong>Address:</strong> {restaurant.address}</p>
        <p><strong>Hours:</strong> {restaurant.hours}</p>
        <p><strong>Parking:</strong> {restaurant.parking ? 'Yes' : 'No'}</p>
        <p><strong>Tables:</strong> {restaurant.tables}</p>
        <p><strong>Rating:</strong> ⭐ {restaurant.rating || 'N/A'}</p>
      </div>
    </div>
  );
}
