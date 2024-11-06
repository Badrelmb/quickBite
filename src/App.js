import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './MainPage';  // Import the MainPage component
import PostLoginPage from './PostLoginPage'; // Post-login page
import RegisterMyRestaurant from './RegisterMyRestaurant';
import 'bootstrap/dist/css/bootstrap.min.css';
function App() {
  return (
    <Router>
      <Routes>
        {/* Define the routes */}
        <Route path="/" element={<MainPage />} /> {/* Login page */}
        <Route path="/post-login" element={<PostLoginPage />} /> {/* Post-login page */}
        <Route path="/register-restaurant" element={<RegisterMyRestaurant />} />
       
      </Routes>
    </Router>
  );
}

export default App;
