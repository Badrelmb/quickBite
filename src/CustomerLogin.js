import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CustomerLogin.css';
import logo from './logo_transparent.png';
import { supabase } from './supabaseClient';
import { useLocation } from 'react-router-dom';




const CustomerLogin = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const location = useLocation();
const redirectTo = new URLSearchParams(location.search).get('redirectTo');


  const handleLogin = async () => {
  let emailToLoginWith = identifier;

  // Case 1: If user typed a client ID, fetch the associated email
  if (!identifier.includes('@') && !identifier.match(/^\d{10,}$/)) {
    const { data, error } = await supabase
      .from('clients')
      .select('email')
      .eq('client_id', identifier)
      .single();

    if (error || !data) {
      alert('Invalid Client ID.');
      return;
    }

    emailToLoginWith = data.email;
  }

  // Case 2: If it's a phone number, find email from phone
  if (identifier.match(/^\d{10,}$/)) {
    const { data, error } = await supabase
      .from('clients')
      .select('email')
      .eq('phone', identifier)
      .single();

    if (error || !data) {
      alert('Phone number not found.');
      return;
    }

    emailToLoginWith = data.email;
  }

  // Final login using email + password
  const { error: loginError } = await supabase.auth.signInWithPassword({
    email: emailToLoginWith,
    password,
  });

  if (loginError) {
    alert('Login failed: ' + loginError.message);
  } else {
    // Navigate to post-login page
    navigate(redirectTo || '/client-dashboard');
  }
};

 

  const handleForgotPassword = () => {
    // TODO: Handle password recovery
    alert('Password recovery not implemented yet.');
  };

  return (
    <div className="main-page">
      <header className="main-header">
        <img src={logo} alt="QuickBite Logo" className="logo" />
      </header>
    <div className="customer-login-container">
      
      <div className="form-box">
        <h1>LOGIN TO USE OUR SERVICES</h1>
      <input
         placeholder="Phone number, Email, or Client ID"
  value={identifier}
  onChange={(e) => setIdentifier(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="button-group">
        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>
        <button className="signup-btn" onClick={() => navigate('/customer-signup')}>
  Sign Up
</button>
      </div>

      <p className="forgot-link" onClick={handleForgotPassword}>
        Forgot my password?
      </p>
    </div>
    </div>
    </div>
  );
};

export default CustomerLogin;
