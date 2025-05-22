import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import MenuItems from './MenuItems';
import OrderSummary from './OrderSummary';
import CategoriesSidebar from './CategoriesSidebar';
import logo from './logo_transparent.png';
import './ClientOrderPage.css';
import { useLocation } from 'react-router-dom';


export default function ClientOrderPage() {
  
  const navigate = useNavigate();
  const [authUserID, setAuthUserID] = useState('');
  const [clientID, setClientID] = useState('');
  const [restaurantID, setRestaurantID] = useState(''); // you’ll pass this via prop or URL later
  const [order, setOrder] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const location = useLocation();
const searchParams = new URLSearchParams(location.search);
const restaurantFromURL = searchParams.get('restaurant_id');
const tableFromURL = searchParams.get('table');


console.log('🚀 Loaded ClientOrderPage with:', { restaurantFromURL, tableFromURL });
  // 1. Fetch authenticated client ID
  useEffect(() => {
    const getClientID = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
  
      const user = session?.user;
  
      if (!user) {
        // Capture current full path
        const currentPath = window.location.pathname + window.location.search;
        navigate(`/customer-login?redirectTo=${encodeURIComponent(currentPath)}`);
        return;
      }
  
      // ✅ Save the Supabase Auth UUID for inserting into orders
      setAuthUserID(user.id);
  
      // 🔍 Get the user’s custom client_id (e.g., "test1") for display
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
  }, [navigate]);
  
  
  // 2. Load menu for the restaurant
  useEffect(() => {
    if (!restaurantFromURL) return;
  
    setRestaurantID(restaurantFromURL);
  
    const fetchMenu = async () => {
      const { data, error } = await supabase
        .from('menus')
        .select('*')
        .eq('restaurant_id', restaurantFromURL);
  
      if (error) {
        console.error('Menu load error:', error);
      } else {
        setMenuData(data);
      }
    };
  
    fetchMenu();
  }, [restaurantFromURL]);
  

  // 3. Add item to order
  const handleAddToOrder = (item) => {
    console.log('🛒 Adding item to order:', item);
  
    if (!item || !item.id) {
      console.error('❌ Invalid item passed to handleAddToOrder:', item);
      return;
    }
  
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
      price: item.price
    }));
    
    console.log('🧾 Attempting to place order:', {
      client_id: clientID,
      restaurant_id: restaurantID,
      table_number: Number(tableFromURL),
      menu_items,
      status: 'pending'
    });
    
    const { error } = await supabase.from('orders').insert([
      {
        client_id: clientID,
        restaurant_id: restaurantID,
        table_number: Number(tableFromURL),
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


