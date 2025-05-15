import React, { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import MainPage from './MainPage';
import PostLoginPage from './PostLoginPage';
import RegisterMyRestaurant from './RegisterMyRestaurant';
import RestaurantManagementPage from './restaurantManagementPage';
import MenuManagementPage from './MenuManagementPage';
import TableManagement from './TableManagement';
import Orders from './Orders';
import SalesData from './SalesData';
import CustomerPage from './CustomerPage';
import CustomerLogin from './CustomerLogin';
import CoverPage from './coverPage';
import CustomerSignUp from './CustomerSignUp';
import EmailConfirmedPage from './EmailConfirmedPage';
import ClientDashboard from './ClientDashboard';
import ScanQR from './ScanQR';
import LoginRedirector from './LoginRedirector';
import ClientOrderPage from './ClientOrderPage';
import Redirect from './Redirect';
import RestaurantInfo from './RestaurantInfo';
import NavigateToClientOrder from './NavigateToClientOrder';



function AppRoutes() {
  const [showCover, setShowCover] = useState(true);
  const navigate = useNavigate(); // Now safe to use!

  const handleManagerSelect = () => {
    setShowCover(false);
    navigate('/'); // navigate to MainPage
  };

  return (
    <>
      {showCover && <CoverPage onManagerSelect={handleManagerSelect} />}

      <Routes>
        <Route path="/customer-login" element={<CustomerLogin />} />
        <Route path="/CustomerPage" element={<CustomerPage />} />
        <Route path="/client-dashboard" element={<ClientDashboard />} />
        <Route path="/customer-signup" element={<CustomerSignUp />} />
        <Route path="/email-confirmed" element={<EmailConfirmedPage />} />
        <Route path="/scan-qr" element={<ScanQR />} />
         <Route path="/login-redirect" element={<LoginRedirector />} />
         <Route path="/redirect" element={<Redirect />} />
         <Route path="/restaurant/:id" element={<RestaurantInfo />} />

        {!showCover && (
          <>
            <Route path="/" element={<MainPage />} />
            <Route path="/post-login" element={<PostLoginPage />} />
            <Route path="/register-restaurant" element={<RegisterMyRestaurant />} />
            <Route path="/restaurant-management" element={<RestaurantManagementPage />} />
            <Route path="/menu-management" element={<MenuManagementPage />} />
            <Route path="/table-management" element={<TableManagement />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/sales-data" element={<SalesData />} />
            <Route path="/client-order" element={<ClientOrderPage />} />
            <Route path="/redirect" element={<NavigateToClientOrder />} />


          </>
        )}
      </Routes>
    </>
  );
}

export default AppRoutes;
