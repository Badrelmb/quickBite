import React, { useState, useEffect } from 'react';
import './Orders.css'; // Import your custom CSS
import './restaurantManagementPage.css';
import logo from './logo_transparent.png'; // Assuming logo image
import { useNavigate } from 'react-router-dom';

function Orders() {
  const [orders, setOrders] = useState([]); // State to hold the list of orders
  const navigate = useNavigate();
  const restaurantName = "Your Restaurant Name";
  const userID = "USER123"; // Example user ID
  // Example orders to simulate new incoming orders
  const exampleOrders = [
    {
      id: 1,
      items: [
        { menuName: 'Spaghetti Bolognese', quantity: 2, specialRequests: 'No cheese' },
        { menuName: 'Caesar Salad', quantity: 1, specialRequests: 'Extra dressing' }
      ],
      time: new Date().toLocaleTimeString()
    },
    {
      id: 2,
      items: [
        { menuName: 'Margherita Pizza', quantity: 1, specialRequests: 'Well done' },
        { menuName: 'Iced Lemon Tea', quantity: 2, specialRequests: 'Less ice' }
      ],
      time: new Date().toLocaleTimeString()
    }
  ];

  useEffect(() => {
    // Simulate receiving the first order after 10 seconds
    const firstOrderTimeout = setTimeout(() => {
      setOrders((prevOrders) => [...prevOrders, exampleOrders[0]]);
    }, 10000);

    // Simulate receiving the second order 10 seconds later
    const secondOrderTimeout = setTimeout(() => {
      setOrders((prevOrders) => [...prevOrders, exampleOrders[1]]);
    }, 20000);

    // Clean up timeouts when the component unmounts
    return () => {
      clearTimeout(firstOrderTimeout);
      clearTimeout(secondOrderTimeout);
    };
  }, []);

  // Handle the "Served" button click
  const handleServed = (orderId) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
  };
  const handleLogout = () => {
    // Clear any user session data here
    navigate('/'); // Redirect to login page
  };

  return (
    <div className="orders-page">
      {/* <Header userID="USER123" onLogout={() => {}} />  */}
        <header className="register-header d-flex justify-content-between align-items-center py-3 px-4">
        <img src={logo} alt="QuickBite Logo" className="logo" />
        <div className="user-section d-flex align-items-center">
          <div className="user-id mr-3">{userID}</div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="main-content">
        <h1>Live Orders</h1>
        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <div className="orders-container">
            {orders.map((order) => (
              <div key={order.id} className="order-card">
                <p><strong>Order Time:</strong> {order.time}</p>
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <p><strong>Menu:</strong> {item.menuName}</p>
                    <p><strong>Quantity:</strong> {item.quantity}</p>
                    <p><strong>Special Requests:</strong> {item.specialRequests}</p>
                  </div>
                ))}
                <button className="btn btn-success" onClick={() => handleServed(order.id)}>
                  Served
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Orders;
