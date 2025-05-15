import React, { useState } from 'react';
import './CustomerLogin.css'; 
import logo from './logo_transparent.png';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';





function CustomerSignUp() {
  const navigate = useNavigate();
  const [clientId, setClientId] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Step 1: Check if client_id already exists
    const { data: existing, error: fetchError } = await supabase
      .from('clients')
      .select('client_id')
      .eq('client_id', clientId);

    if (fetchError) {
      setError('Error checking ID availability.');
      return;
    }

    if (existing.length > 0) {
      setError('Client ID already exists. Please choose another.');
      return;
    }

    // Step 2: Register the user
   const { data: signUpData, error: authError } = await supabase.auth.signUp({
  email,
  password,
});


    if (authError) {
      setError('Failed to register: ' + authError.message);
      return;
    }

    const userId = signUpData.user.id;

    // Step 3: Insert into clients table
    const { error: insertError } = await supabase.from('clients').insert([
      {
        id: userId,
        client_id: clientId,
        phone,
        email,
      },
    ]);

    if (insertError) {
      setError('Registered, but failed to store user info: ' + insertError.message);
    } else {
     setSuccess('Sign-up successful! Redirecting to login...');
setTimeout(() => {
  navigate('/customer-login'); // change this route to match your actual login path
}, 2000);

    }
  };


  return (
  <div className="main-page">
    <header className="main-header">
      <img src={logo} alt="QuickBite Logo" className="logo" />
    </header>

    <div className="customer-login-container">
      <div className="form-box">
        <h2>Sign Up</h2>

        <input
          type="text"
          placeholder="Client ID"
          value={clientId}
          onChange={(e) => setClientId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}

        <button className="signup-btn" onClick={handleSubmit}>
          Sign Up
        </button>
      </div>
    </div>
  </div>
);
};

export default CustomerSignUp;
