import React from 'react';
import logo from './logo_transparent.png';

function EmailConfirmedPage() {
  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
     <header className="main-header">
        <img src={logo} alt="QuickBite Logo" className="logo" />
      </header>

      <h2>Your email has been confirmed! 🎉</h2>
      <p>You can now log in and start using QuickBite.</p>
    </div>
  );
}

export default EmailConfirmedPage;
