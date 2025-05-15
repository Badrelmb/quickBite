import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

function LoginRedirector() {
  const navigate = useNavigate();

  useEffect(() => {
   const checkRestaurant = async () => {
  console.log("👣 Step 1: Checking user...");
  const { data: { user }, error } = await supabase.auth.getUser();
  console.log("👣 Step 1.1: user =", user);

  if (error || !user) {
    console.log("⛔ No user found. Redirecting to login.");
    navigate('/');
    return;
  }

  console.log("✅ User found. Fetching owner_id...");

  const { data: ownerData, error: ownerError } = await supabase
    .from('restaurant_owners')
    .select('owner_id')
    .eq('user_id', user.id)
    .single();

  console.log("👣 Step 2: ownerData =", ownerData);

  if (ownerError || !ownerData) {
    console.log("⛔ Owner not found. Redirecting to login.");
    navigate('/');
    return;
  }

  console.log("✅ Owner found:", ownerData.owner_id);
  console.log("👣 Step 3: Checking for restaurants...");

  const { data: restaurantsData } = await supabase
    .from('restaurants')
    .select('id')
    .eq('owner_id', ownerData.owner_id);

  console.log("✅ Restaurants found:", restaurantsData);

  if (!restaurantsData || restaurantsData.length === 0) {
    console.log("📭 No restaurants found. Redirecting to post-login.");
    navigate('/post-login');
  } else {
    console.log("🍽️ Restaurants exist. Redirecting to management.");
    navigate('/restaurant-management');
  }
};


    checkRestaurant();
  }, []);

  return <div className="loading-screen">Checking your restaurant status...</div>;
}

export default LoginRedirector;
