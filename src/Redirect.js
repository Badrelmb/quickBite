// Redirect.js
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from './supabaseClient';

export default function Redirect() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleRedirect = async () => {
      const restaurant_id = searchParams.get('restaurant_id');
      const table = searchParams.get('table');

      if (!restaurant_id || !table) {
        alert('Invalid QR code.');
        navigate('/');
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        // User is logged in → go directly to order page
        navigate(`/client-order?restaurant_id=${restaurant_id}&table=${table}`);
      } else {
        // User not logged in → save redirect info and go to login
        sessionStorage.setItem('redirect_restaurant', restaurant_id);
        sessionStorage.setItem('redirect_table', table);
        navigate('/customer-login');
      }
    };

    handleRedirect();
  }, [navigate, searchParams]);

  return null; 
}
