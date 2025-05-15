import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import MenuItems from './MenuItems';
import OrderSummary from './OrderSummary';
import CategoriesSidebar from './CategoriesSidebar';
import logo from './logo_transparent.png';
import './ClientOrderPage.css';

export default function ClientOrderPage() {
  const navigate = useNavigate();
  const [clientID, setClientID] = useState('');
  const [restaurantID, setRestaurantID] = useState(''); // you’ll pass this via prop or URL later
  const [order, setOrder] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);


  // 1. Fetch authenticated client ID
  useEffect(() => {
    const getClientID = async () => {
      const {
        data: { user },
        error
      } = await supabase.auth.getUser();
      if (error || !user) {
        navigate('/customer-login');
        return;
      }

      const { data: clientRow, error: clientError } = await supabase
        .from('clients')
        .select('client_id')
        .eq('id', user.id)
        .single();

      if (clientError || !clientRow) {
        alert('Client record not found.');
        navigate('/');
        return;
      }

      setClientID(clientRow.client_id);
    };

    getClientID();
  }, []);

  // 2. Load menu for the restaurant
  useEffect(() => {
    const fetchMenu = async () => {
     const targetRestaurantID = 'b47c38c0-d4a0-4fb2-9bd4-d8696a394ab3'; // TEMP: Replace this with actual logic
      setRestaurantID(targetRestaurantID);

      const { data, error } = await supabase
        .from('menus')
        .select('*')
        .eq('restaurant_id', targetRestaurantID);

      if (error) {
        console.error('Menu load error:', error);
      } else {
        setMenuData(data);
        console.log('🍽️ Menu Data:', data);
      }
    };

    fetchMenu();
  }, []);

  // 3. Add item to order
  const handleAddToOrder = (item) => {
    setOrder((prevOrder) => {
      const existing = prevOrder.find((o) => o.id === item.id);
      if (existing) {
        return prevOrder.map((o) =>
          o.id === item.id ? { ...o, quantity: o.quantity + 1 } : o
        );
      } else {
        return [...prevOrder, { ...item, quantity: 1 }];
      }
    });
  };

  // 4. Place order
  const handlePlaceOrder = async () => {
    if (!clientID || !restaurantID || order.length === 0) {
      alert('Incomplete order.');
      return;
    }

    const menu_items = order.map((item) => ({
      menu_id: item.id,
      name: item.name,
      quantity: item.quantity,
      special_requests: item.special_requests || ''
    }));

    const { error } = await supabase.from('orders').insert([
      {
        client_id: clientID,
        restaurant_id: restaurantID,
        table_number: 1,
        menu_items,
        status: 'pending'
      }
    ]);

    if (error) {
      console.error('Order failed:', error);
      alert('Failed to place order.');
    } else {
      alert('Order placed successfully!');
      setOrder([]);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/customer-login');
  };
useEffect(() => {
  const uniqueCategories = Array.from(new Set(
    menuData
      .map((item) => item.category?.trim())
      .filter(Boolean)
  ));
 console.log('📦 Extracted Categories:', uniqueCategories);
  setCategories(['All', ...uniqueCategories]);
}, [menuData]);



  return (
    <div className="client-order-page">
      {/* ─── Header ─── */}
      <header className="client-header">
        <div className="header-inner">
          <div className="spacer" />
          <img src={logo} alt="QuickBite Logo" className="logo" />
          <div className="user-section">
            <div className="user-id">{clientID || 'Loading...'}</div>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* ─── Layout ─── */}
      <div className="order-layout">
        <CategoriesSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />
        <MenuItems
          menuData={menuData}
          selectedCategory={selectedCategory}
          onAddToOrder={handleAddToOrder}
        />
        <OrderSummary order={order} onPlaceOrder={handlePlaceOrder} />
      </div>
    </div>
  );
}


