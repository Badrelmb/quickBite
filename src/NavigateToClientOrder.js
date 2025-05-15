import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export default function NavigateToClientOrder() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const restaurant_id = params.get("restaurant_id");
    const table = params.get("table");

    if (restaurant_id && table) {
      const target = `/client-order?restaurant_id=${restaurant_id}&table=${table}`;
      navigate(target, { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  }, [location, navigate]);

  return null;
}
