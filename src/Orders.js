import { useState, useEffect, useRef } from 'react';
import './Orders.css';
import './restaurantManagementPage.css';
import logo from './logo_transparent.png';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [ownerID, setOwnerID] = useState('');
  const navigate = useNavigate();
   const previousCountRef = useRef(0);

  useEffect(() => {
    const fetchOrders = async () => {
      // Step 1: Get logged-in owner
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/');
        return;
      }

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

      // Step 2: Get ALL restaurants linked to this owner
      const { data: restaurantRows, error: restError } = await supabase
        .from('restaurants')
        .select('id')
        .eq('owner_id', ownerRow.owner_id);

      if (restError || !restaurantRows || restaurantRows.length === 0) {
        alert('Restaurant not found for this owner');
        return;
      }

      const restaurantIDs = restaurantRows.map((r) => r.id);

      // Step 3: Fetch orders for all those restaurants
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .select('*')
        .in('restaurant_id', restaurantIDs)
        .eq('status', 'pending')
        .order('ordered_at', { ascending: false });

      if (orderError) {
        console.error('Order fetch error:', orderError);
        return;
      }

      setOrders(orderData);
      if (orderData.length > previousCountRef.current) {
  const audio = new Audio('https://notificationsounds.com/storage/sounds/file-sounds-1152-pristine.mp3');
  audio.play();
}
previousCountRef.current = orderData.length;

    };

    fetchOrders();
  }, [navigate]);

  const handleServed = async (orderId) => {
    const { error } = await supabase
      .from('orders')
      .update({ status: 'served' })
      .eq('id', orderId);

    if (error) {
      console.error('Failed to update order:', error);
      return;
    }

    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="orders-page">
      <header className="register-header d-flex justify-content-between align-items-center py-3 px-4">
        <img src={logo} alt="QuickBite Logo" className="logo" />
        <div className="user-section d-flex align-items-center">
          <div className="user-id mr-3">{ownerID || 'Loading...'}</div>
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
                <p><strong>Table:</strong> {order.table_number}</p>
                <p><strong>Order Time:</strong> {new Date(order.ordered_at).toLocaleTimeString()}</p>
                {order.menu_items.map((item, index) => (
                  <div key={index} className="order-item">
                    <p><strong>Menu:</strong> {item.name}</p>
                    <p><strong>Quantity:</strong> {item.quantity}</p>
                    <p><strong>Special Requests:</strong> {item.special_requests || '—'}</p>
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
