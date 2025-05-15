import React, { useState, useEffect } from 'react';
import './RegisterMyRestaurant.css';
import logo from './logo_transparent.png';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

function RegisterMyRestaurant() {
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(50);
  const navigate = useNavigate();

  // Authenticated user ID from Supabase
  const [userID, setUserID] = useState(null);

useEffect(() => {
  const fetchUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) {
      console.error('Failed to fetch user', error.message);
    } else {
      setUserID(user.id);

      // Fetch owner_id from restaurant_owners table
      const { data, error: ownerError } = await supabase
        .from('restaurant_owners')
        .select('owner_id')
        .eq('user_id', user.id)
        .single();

      if (ownerError) {
        console.error('Failed to fetch owner ID', ownerError.message);
      } else {
        setOwnerID(data.owner_id);
      }
    }
  };

  fetchUser();
}, []);


  // Form state
  const [restaurantName, setRestaurantName] = useState('');
  const [category, setCategory] = useState('Korean');
  const [logoFile, setLogoFile] = useState(null);
  const [address, setAddress] = useState('');
  const [hours, setHours] = useState('');
  const [parking, setParking] = useState(null);
  const [tables, setTables] = useState(1);
  const [ownerID, setOwnerID] = useState(null);

  const nextStep = (e) => {
    e.preventDefault();
    setStep(step + 1);
    setProgress(100);
  };

  const prevStep = () => {
    setStep(step - 1);
    setProgress(50);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!userID) {
        alert('User not authenticated. Please log in again.');
        return;
      }

      let logoUrl = null;

      // Step 1: Upload logo if file is provided
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const filePath = `${Date.now()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('restaurant-logos')
          .upload(filePath, logoFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('restaurant-logos')
          .getPublicUrl(filePath);

        logoUrl = urlData.publicUrl;
      }

      // Step 2: Insert into restaurants table
      const { error: insertError } = await supabase
        .from('restaurants')
        .insert([
          {
            owner_id: userID,
            name: restaurantName,
            logo_url: logoUrl,
            category: category,
            address: address,
            hours: hours,
            parking: parking,
            tables: tables,
          },
        ]);

      if (insertError) throw insertError;

      // Step 3: Redirect
      navigate('/restaurant-management');
    } catch (err) {
      alert('Registration failed: ' + err.message);
      console.error(err);
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  const CATEGORY_OPTIONS = [
  'Desserts', 'Western', 'Sandwiches', 'Coffee & Tea', 'Burgers',
  'Chicken', 'Curry', 'Japanese', 'Korean', 'Healthy',
  'Pizza', 'Bubble Tea', 'Mexican', 'Ramen', 'Dumplings', 'Bakery'
];

  return (
    <div className="register-restaurant-page">
      <header className="register-header">
        <img src={logo} alt="QuickBite Logo" className="logo" />
        <div className="user-section">
          <div className="user-id">{ownerID || 'Loading ID...'}</div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="progress-bar">
        <div className="progress" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="content-wrapper">
        <div className="form-container d-flex flex-column align-items-center">
          {step === 1 && (
            <div className="step-1 w-100">
              <h2>Step 1: Basic Info</h2>
              <form onSubmit={nextStep}>
                <div className="form-group">
                  <label>Restaurant Name:</label>
                  <input type="text" required value={restaurantName} onChange={(e) => setRestaurantName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Restaurant Logo:</label>
                  <input type="file" accept="image/*" onChange={(e) => setLogoFile(e.target.files[0])} />
                </div>
                <div className="form-group">
                  <label>Category:</label>
               <select value={category} onChange={(e) => setCategory(e.target.value)} required>
  {CATEGORY_OPTIONS.map((cat) => (
    <option key={cat} value={cat}>{cat}</option>
  ))}
</select>

                </div>
                <div className="button-container">
                  <button type="submit" className="next-btn">Next</button>
                </div>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="step-2 w-100">
              <h2>Step 2: Details</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Address:</label>
                  <input type="text" required value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Hours of Operation:</label>
                  <input type="text" placeholder="e.g. 9am - 5pm" required value={hours} onChange={(e) => setHours(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Parking Available:</label>
                  <div className="radio-group">
                    <input type="radio" id="parkingYes" name="parking" value="yes" onChange={() => setParking(true)} />
                    <label htmlFor="parkingYes">Yes</label>
                    <input type="radio" id="parkingNo" name="parking" value="no" onChange={() => setParking(false)} />
                    <label htmlFor="parkingNo">No</label>
                  </div>
                </div>
                <div className="form-group">
                  <label>Number of Tables:</label>
                  <input type="number" min="1" required value={tables} onChange={(e) => setTables(parseInt(e.target.value))} />
                </div>
                <div className="button-group">
                  <button type="button" onClick={prevStep} className="prev-btn">Previous</button>
                  <button type="submit" className="submit-btn">Submit</button>
                </div>
              </form>
            </div>
          )}
        </div>

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
