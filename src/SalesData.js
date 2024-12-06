import React, { useState } from 'react';
import './SalesData.css'; // Import your custom CSS
import './restaurantManagementPage.css';
import logo from './logo_transparent.png'; // Assuming logo image
import Chart from '.src/Chart';
import { useNavigate } from 'react-router-dom';


function SalesData() {
  const [filter, setFilter] = useState('daily'); // State to track the selected filter
const navigate = useNavigate();
const userID = "USER123";
  // Sample sales data with random dates and menu items
  const salesData = [
  { menuName: 'Burger', quantity: 5, price: 8.99, date: new Date(2024, 10, 15) },
  { menuName: 'Pasta', quantity: 2, price: 12.99, date: new Date(2024, 10, 15) },
  { menuName: 'Salad', quantity: 3, price: 6.99, date: new Date(2024, 10, 14) },
  { menuName: 'Pizza', quantity: 8, price: 14.99, date: new Date(2024, 10, 13) },
  { menuName: 'Soup', quantity: 4, price: 5.99, date: new Date(2024, 9, 10) },
  { menuName: 'Steak', quantity: 6, price: 19.99, date: new Date(2024, 9, 5) },
  { menuName: 'Fish Tacos', quantity: 2, price: 9.99, date: new Date(2024, 8, 20) },
  { menuName: 'Smoothie', quantity: 7, price: 4.99, date: new Date(2024, 8, 15) },
  { menuName: 'Cake', quantity: 10, price: 3.99, date: new Date(2024, 7, 10) },
  { menuName: 'Coffee', quantity: 12, price: 2.99, date: new Date(2024, 6, 30) },
  { menuName: 'Ice Cream', quantity: 9, price: 3.49, date: new Date(2024, 5, 25) },
  { menuName: 'Pancakes', quantity: 4, price: 7.99, date: new Date(2024, 4, 15) },
  { menuName: 'Sushi', quantity: 3, price: 14.99, date: new Date(2024, 3, 5) },
  { menuName: 'BBQ Ribs', quantity: 6, price: 16.99, date: new Date(2024, 2, 1) },
  { menuName: 'Dumplings', quantity: 8, price: 6.99, date: new Date(2024, 1, 20) },
  { menuName: 'Sandwich', quantity: 2, price: 5.49, date: new Date(2023, 11, 15) },
  { menuName: 'Fried Rice', quantity: 5, price: 8.99, date: new Date(2023, 10, 10) },
  { menuName: 'Hot Dog', quantity: 7, price: 3.99, date: new Date(2023, 8, 5) },
  { menuName: 'Brownie', quantity: 4, price: 2.99, date: new Date(2023, 6, 25) },
  { menuName: 'Tea', quantity: 9, price: 1.99, date: new Date(2023, 4, 10) },
];

  // Filter sales data based on the selected category
  const filteredSales = salesData.filter((sale) => {
    const today = new Date();
    const saleDate = sale.date;

    switch (filter) {
      case 'daily':
        return saleDate.toDateString() === today.toDateString();
      case 'weekly':
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(today.getDate() - 7);
        return saleDate >= oneWeekAgo && saleDate <= today;
      case 'monthly':
        return saleDate.getMonth() === today.getMonth() && saleDate.getFullYear() === today.getFullYear();
      case 'yearly':
        return saleDate.getFullYear() === today.getFullYear();
      default:
        return true;
    }
  });

   // Calculate total price for the filtered sales
  const totalSalesPrice = filteredSales.reduce((total, sale) => {
    return total + sale.quantity * sale.price;
  }, 0);

const topItems = [...filteredSales].sort((a, b) => b.quantity - a.quantity).slice(0, 3);

  const chartData = {
    labels: topItems.map((item) => item.menuName),
    datasets: [
      {
        label: 'Quantity Sold',
        data: topItems.map((item) => item.quantity),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Amount Sold ($)',
        data: topItems.map((item) => (item.quantity * item.price).toFixed(2)),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  const chartOptions = {
    responsive: false,
    aspectratio: 3,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };


const handleLogout = () => {
    // Clear any user session data here
    navigate('/'); // Redirect to login page
  };
  return (
    <div className="sales-data-page">
      {/* <Header userID="USER123" onLogout={() => {}} /> Replace with your logout logic */}
        <header className="register-header d-flex justify-content-between align-items-center py-3 px-4">
        <img src={logo} alt="QuickBite Logo" className="logo" />
        <div className="user-section d-flex align-items-center">
          <div className="user-id mr-3">{userID}</div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <main className="main-content">
        <h1>Sales Data</h1>
        <div className="filter-buttons">
            <button
            className={`btn ${filter === 'daily' ? 'active' : ''}`}
            onClick={() => setFilter('daily')}
          >
            Daily
          </button>
          <button
            className={`btn ${filter === 'weekly' ? 'active' : ''}`}
            onClick={() => setFilter('weekly')}
          >
            Weekly
          </button>
          <button
            className={`btn ${filter === 'monthly' ? 'active' : ''}`}
            onClick={() => setFilter('monthly')}
          >
            Monthly
          </button>
          <button
            className={`btn ${filter === 'yearly' ? 'active' : ''}`}
            onClick={() => setFilter('yearly')}
          >
            Yearly
          </button>
        </div>
         <h2 className="total-price">TOTAL PRICE: ${totalSalesPrice.toFixed(2)}</h2>

         <table className="sales-table">
          <thead>
            <tr>
              <th>Menu Name</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total Price</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredSales.map((sale, index) => (
              <tr key={index}>
                <td>{sale.menuName}</td>
                <td>{sale.quantity}</td>
                <td>${sale.price.toFixed(2)}</td>
                <td>${(sale.quantity * sale.price).toFixed(2)}</td>
                <td>{sale.date.toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2 className='top3items'>Top 3 Selling Items</h2>
        <div className="chart-container">
          <Chart data={chartData} options={chartOptions} />
        </div>
      </main>
    </div>
  );
}

export default SalesData;
