import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './logo_transparent.png';
import './PostLoginPage.css';
import { supabase } from './supabaseClient';

function PostLoginPage() {
  const navigate = useNavigate();
  const [ownerID, setOwnerID] = useState('');

  useEffect(() => {
    const fetchOwnerInfo = async () => {
      const {
        data: { user },
        error
      } = await supabase.auth.getUser();

      if (error || !user) {
        navigate('/'); // back to cover or login page
        return;
      }

      const { data: ownerRow, error: ownerError } = await supabase
        .from('restaurant_owners')
        .select('owner_id')
        .eq('id', user.id)
        .single();

      if (ownerError || !ownerRow) {
        alert('Owner not found. Please register.');
        navigate('/');
        return;
      }

      setOwnerID(ownerRow.owner_id);
    };

    fetchOwnerInfo();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="post-login-page">
      <header className="post-login-header">
        <img src={logo} alt="QuickBite Logo" className="logo" />
        <div className="user-section">
          <div className="user-id">{ownerID || 'Loading...'}</div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="main-content">
        <h1>Welcome!</h1>
        <p>Let’s get started by registering your restaurant.</p>
        <button onClick={() => navigate('/register-restaurant')}>
          Register My Restaurant
        </button>
      </main>
    </div>
  );
}

export default PostLoginPage;
