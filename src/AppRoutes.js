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
  const navigate = useNavigate();

  const handleManagerSelect = () => {
    setShowCover(false);
    navigate('/'); // will now show <MainPage />
  };

  return (
    <Routes>
      {/* Special case: root path */}
      <Route
        path="/"
        element={showCover ? <CoverPage onManagerSelect={handleManagerSelect} /> : <MainPage />}
      />

      {/* Client/customer flow */}
      <Route path="/customer-login" element={<CustomerLogin setShowCover={setShowCover} />} />
      <Route path="/customer-signup" element={<CustomerSignUp />} />
      <Route path="/email-confirmed" element={<EmailConfirmedPage />} />
      <Route path="/client-dashboard" element={<ClientDashboard setShowCover={setShowCover} />} />
      <Route path="/client-order" element={<ClientOrderPage />} />
      <Route path="/scan-qr" element={<ScanQR />} />
      <Route path="/CustomerPage" element={<CustomerPage />} />
      <Route path="/restaurant/:id" element={<RestaurantInfo />} />

      {/* Auth helpers */}
      <Route path="/redirect" element={<Redirect />} />
      <Route path="/login-redirect" element={<LoginRedirector />} />

      {/* Manager flow */}
      <Route path="/post-login" element={<PostLoginPage />} />
      <Route path="/register-restaurant" element={<RegisterMyRestaurant />} />
      <Route path="/restaurant-management" element={<RestaurantManagementPage setShowCover={setShowCover} />} />
      <Route path="/menu-management" element={<MenuManagementPage setShowCover={setShowCover} />} />
      <Route path="/table-management" element={<TableManagement />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/sales-data" element={<SalesData />} />
    </Routes>
  );
}

export default AppRoutes;
