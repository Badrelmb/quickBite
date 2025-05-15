import React, { useEffect, useState, useRef } from 'react';
import './SalesData.css';
import './restaurantManagementPage.css';
import logo from './logo_transparent.png';
import Chart from './Chart';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

function SalesData() {
  const [filter, setFilter] = useState('daily');
  const [ownerID, setOwnerID] = useState('');
  const [salesData, setSalesData] = useState([]);
  const navigate = useNavigate();

  const previousRestaurantIDRef = useRef(null);

  useEffect(() => {
    const fetchSales = async () => {
      // Step 1: Get logged-in user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/');
        return;
      }

      // Step 2: Get owner_id
      const { data: ownerRow, error: ownerError } = await supabase
        .from('restaurant_owners')
        .select('owner_id')
        .eq('user_id', user.id)
        .single();

      if (ownerError || !ownerRow) {
        alert('Owner record not found');
        navigate('/');
        return;
      }

      setOwnerID(ownerRow.owner_id);

      // Step 3: Get restaurant(s)
      const { data: restaurants, error: restError } = await supabase
        .from('restaurants')
        .select('id')
        .eq('owner_id', ownerRow.owner_id);

      if (restError || !restaurants || restaurants.length === 0) {
        alert('No restaurant found for this owner.');
        return;
      }

      const restaurantIDs = restaurants.map(r => r.id);
      previousRestaurantIDRef.current = restaurantIDs;

      // Step 4: Fetch served orders
      const { data: orders, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .in('restaurant_id', restaurantIDs)
        .eq('status', 'served');

      if (orderError) {
        console.error('Failed to fetch orders:', orderError);
        return;
      }

      // Step 5: Flatten orders → [{ menuName, quantity, price, date }]
      const flattened = orders.flatMap(order =>
        order.menu_items.map(item => ({
          menuName: item.name,
          quantity: item.quantity,
          price: item.price || 0,
          date: new Date(order.ordered_at)
        }))
      );

      setSalesData(flattened);
    };

    fetchSales();
  }, [navigate]);

  // ───── Filter logic ─────
  const today = new Date();

  const filteredSales = salesData.filter(sale => {
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

  const totalSalesPrice = filteredSales.reduce((total, sale) => total + sale.quantity * sale.price, 0);

  const topItems = [...filteredSales].reduce((acc, sale) => {
    const existing = acc.find(item => item.menuName === sale.menuName);
    if (existing) {
      existing.quantity += sale.quantity;
      existing.total += sale.quantity * sale.price;
    } else {
      acc.push({
        menuName: sale.menuName,
        quantity: sale.quantity,
        total: sale.quantity * sale.price
      });
    }
    return acc;
  }, []).sort((a, b) => b.quantity - a.quantity).slice(0, 3);

  const chartData = {
    labels: topItems.map(item => item.menuName),
    datasets: [
      {
        label: 'Quantity Sold',
        data: topItems.map(item => item.quantity),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      {
        label: 'Amount Sold ($)',
        data: topItems.map(item => item.total.toFixed(2)),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
   maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="sales-data-page">
      <header className="register-header d-flex justify-content-between align-items-center py-3 px-4">
        <img src={logo} alt="QuickBite Logo" className="logo" />
        <div className="user-section d-flex align-items-center">
          <div className="user-id mr-3">{ownerID || 'Loading...'}</div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="main-content">
        <h1>Sales Data</h1>
        <div className="filter-buttons">
          {['daily', 'weekly', 'monthly', 'yearly'].map(option => (
            <button
              key={option}
              className={`btn ${filter === option ? 'active' : ''}`}
              onClick={() => setFilter(option)}
            >
              {option[0].toUpperCase() + option.slice(1)}
            </button>
          ))}
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

        <h2 className="top3items">Top 3 Selling Items</h2>
        <div className="chart-container">
          <Chart data={chartData} options={chartOptions} />
        </div>
      </main>
    </div>
  );
}

export default SalesData;
