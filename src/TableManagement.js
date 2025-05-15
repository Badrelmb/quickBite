import React, { useEffect, useState } from 'react';
import './TableManagement.css';
import logo from './logo_transparent.png';
import { QRCodeCanvas } from 'qrcode.react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

function TableManagement() {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedRestaurant = location.state?.selectedRestaurant;

  const [tableCount, setTableCount] = useState(0);
  const [restaurantName, setRestaurantName] = useState('');

  useEffect(() => {
    const fetchTableInfo = async () => {
      if (!selectedRestaurant) {
        console.warn('No restaurant selected. Redirecting...');
        navigate('/restaurant-management');
        return;
      }

      setRestaurantName(selectedRestaurant.name);

      const { data, error } = await supabase
        .from('restaurants')
        .select('tables')
        .eq('id', selectedRestaurant.id)
        .single();

      if (error || !data) {
        console.error('Error fetching table count:', error);
        return;
      }

      setTableCount(data.tables);
    };

    fetchTableInfo();
  }, [selectedRestaurant, navigate]);

  const updateTableCountInDB = async (newCount) => {
    const { error } = await supabase
      .from('restaurants')
      .update({ tables: newCount })
      .eq('id', selectedRestaurant.id);

    if (error) {
      console.error('Failed to update table count in DB:', error);
    }
  };

  const addTable = async () => {
    const newCount = tableCount + 1;
    setTableCount(newCount);
    await updateTableCountInDB(newCount);
  };

  const deleteTable = async (index) => {
    if (tableCount <= 1) return; // Avoid 0 or negative tables
    const newCount = tableCount - 1;
    setTableCount(newCount);
    await updateTableCountInDB(newCount);
  };

  return (
    <div className="table-management-page TableManagment">
      <header className="register-header">
        <img src={logo} alt="QuickBite Logo" className="logo" />
        <div className="user-section">
          <button className="logout-btn" onClick={() => navigate('/')}>Logout</button>
        </div>
      </header>

      <main className="main-content text-center">
        <div className="back-button" onClick={() => navigate('/restaurant-management')}>
          ← Back
        </div>

        <h1>{restaurantName}</h1>

        {/* Add Table Button */}
        <button className="btn btn-success mb-4" onClick={addTable}>Add a Table</button>

        {/* QR Codes Section */}
        <div className="qr-codes">
          {[...Array(tableCount)].map((_, index) => (
            <div key={index + 1} className="qr-code-container">
              <QRCodeCanvas
  value={`${window.location.origin}/redirect?restaurant_id=${selectedRestaurant.id}&table=${index + 1}`}
  size={150}
/>

              <p>Table {index + 1}</p>
              <button className="delete-btn" onClick={() => deleteTable(index)}>❌</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default TableManagement;
