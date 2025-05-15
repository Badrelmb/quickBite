import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import logo from './logo_transparent.png';
import './ClientDashboard.css';

export default function ClientDashboard() {
  const navigate = useNavigate();
const [clientID, setClientID] = useState('');
const [isSearching, setIsSearching] = useState(false);
const [frequentRestaurants, setFrequentRestaurants] = useState([]);
const [suggestionResults, setSuggestionResults] = useState([]);
const [allRestaurants, setAllRestaurants] = useState([]);
const [availableCategories, setAvailableCategories] = useState([]);



useEffect(() => {
  const fetchClientID = async () => {
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Error fetching user:', authError);
      navigate('/');
      return;
    }

    // Try to find matching client_id in clients table
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select('client_id')
      .eq('id', user.id)
      .single();

    if (clientError || !clientData) {
      alert('This account is not registered as a client.');
      navigate('/');
      return;
    }

    setClientID(clientData.client_id);
  };

  fetchClientID();
}, []);

useEffect(() => {
  if (!clientID) return;

  const fetchFrequentRestaurants = async () => {
    console.log("🔍 Fetching frequently visited restaurants for:", clientID);

    // Get the latest scans (since .group() is not available in JS client)
    const { data: recentScans, error } = await supabase
      .from('qr_scans')
      .select('restaurant_id')
      .eq('client_id', clientID)
      .order('scanned_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('❌ Failed to fetch QR scans:', error);
      return;
    }

    const restaurantIDs = [...new Set(recentScans.map(r => r.restaurant_id))];
    console.log("📦 Recently scanned restaurant IDs:", restaurantIDs);

    if (restaurantIDs.length === 0) {
      setFrequentRestaurants([]);
      return;
    }

    const { data: restaurantData, error: restError } = await supabase
      .from('restaurants')
      .select('id, name, logo_url, rating')
      .in('id', restaurantIDs);

    if (restError) {
      console.error('❌ Failed to fetch restaurant details:', restError);
    } else {
      console.log('✅ Retrieved restaurant details:', restaurantData);
      setFrequentRestaurants(restaurantData);
    }
  };

  fetchFrequentRestaurants();
}, [clientID]);

useEffect(() => {
  if (!clientID) return;

  const fetchSuggestionData = async () => {
    // 1. Get recent QR scans
    const { data: scans, error: scanError } = await supabase
      .from('qr_scans')
      .select('restaurant_id')
      .eq('client_id', clientID)
      .order('scanned_at', { ascending: false })
      .limit(20);

    const visitedRestaurantIDs = scans ? [...new Set(scans.map(s => s.restaurant_id))] : [];

    // 2. Get past orders
    const { data: pastOrders, error: orderError } = await supabase
      .from('orders')
      .select('menu_items')
      .eq('client_id', clientID)
      .eq('status', 'served');

    const orderedItems = pastOrders
      ? pastOrders.flatMap(order => order.menu_items)
      : [];

    // 3. Get recent search keywords
    const { data: searchLogs, error: searchError } = await supabase
      .from('search_logs')
      .select('keyword')
      .eq('client_uuid', supabase.auth.getUser().then(r => r.data.user.id))
      .order('searched_at', { ascending: false })
      .limit(10);

    const keywords = searchLogs ? searchLogs.map(k => k.keyword.toLowerCase()) : [];

    console.log('📦 Activity Summary:', {
      visitedRestaurantIDs,
      orderedItems,
      keywords
    });

    // Step 2A: Get all restaurants and menus
const { data: allRestaurants, error: restError } = await supabase
  .from('restaurants')
  .select('id, name, logo_url, category, rating');

if (restError || !allRestaurants) return;

const { data: allMenus, error: menuError } = await supabase
  .from('menus')
  .select('restaurant_id, name, description, ingredients');

if (menuError || !allMenus) return;

// Step 2B: Normalize data
const orderedNames = orderedItems.map(item => item.name.toLowerCase());
const orderedIngredients = orderedItems.flatMap(item =>
  (item.ingredients || '').toLowerCase().split(',').map(s => s.trim())
);

// Step 2C: Score each restaurant
const scoredRestaurants = allRestaurants.map(rest => {
  let score = 0;

  // 1. Category match
  const visitedCategories = allRestaurants
    .filter(r => visitedRestaurantIDs.includes(r.id))
    .map(r => r.category?.toLowerCase());

  if (visitedCategories.includes(rest.category?.toLowerCase())) {
    score += 2;
  }

  // 2. Menu match
  const thisMenus = allMenus.filter(m => m.restaurant_id === rest.id);
  for (const menu of thisMenus) {
    const name = menu.name.toLowerCase();
    const desc = (menu.description || '').toLowerCase();
    const ingr = (menu.ingredients || '').toLowerCase();

    if (orderedNames.some(n => name.includes(n) || desc.includes(n))) score += 1;
    if (orderedIngredients.some(i => ingr.includes(i))) score += 1;
    if (keywords.some(k => name.includes(k) || desc.includes(k))) score += 1;
  }

  return { ...rest, score };
});

// Step 2D: Filter and sort
const finalSuggestions = scoredRestaurants
  .filter(r => r.score > 0)
  .sort((a, b) => b.score - a.score);

// Save to state
setSuggestionResults(finalSuggestions);

  };

  fetchSuggestionData();
}, [clientID]);

const fetchAllRestaurants = async () => {
  const { data, error } = await supabase
    .from('restaurants')
    .select('id, name, logo_url, category, rating');

  if (error) {
    console.error('Failed to fetch all restaurants:', error);
    return;
  }

  setAllRestaurants(data || []);

  // extract unique categories
  const categories = [...new Set((data || []).map(r => r.category?.trim()).filter(Boolean))];
  setAvailableCategories(categories);
};

useEffect(() => {
  fetchAllRestaurants();
}, []);





  
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState([]);
  const [price, setPrice] = useState(20000);
  const [selectedCategory, setSelectedCategory] = useState(null);
const [filteredRestaurants, setFilteredRestaurants] = useState([]);
const [searchQuery, setSearchQuery] = useState('');
const [searchResults, setSearchResults] = useState([]);


useEffect(() => {
  const filtered = allRestaurants
    .filter(r => {
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every(tag =>
          (r.tags || '').toLowerCase().includes(tag.toLowerCase())
        );

      const matchesPrice = !r.average_price || r.average_price <= price;

      const matchesCategory =
        !selectedCategory || r.category === selectedCategory;

      return matchesTags && matchesPrice && matchesCategory;
    })
    .slice(0, 20);

  setFilteredRestaurants(filtered);
  console.log('📦 All restaurants loaded:', allRestaurants);
}, [allRestaurants, selectedTags, price, selectedCategory]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };
const handleCategorySelect = async (category) => {
  setSelectedCategory(category);
  console.log('Selected category:', category);

  const { data, error } = await supabase
    .from('restaurants')
    .select('name, category, logo_url') // Add other fields as needed
   .eq('category', category.trim());


  if (error) {
    console.error('Failed to fetch restaurants:', error);
    setFilteredRestaurants([]);
  } else {
    setFilteredRestaurants(data);
    console.log('Fetched restaurants:', data);
console.log('Supabase error (if any):', error);

  }
};
const handleSearch = async () => {
  if (!searchQuery.trim()) return;

  try {
    const keyword = `%${searchQuery}%`;
    console.log('🔍 Starting search with keyword:', keyword);

    // 1. Search restaurants by name
    const { data: matchedRestaurants, error: restaurantError } = await supabase
      .from('restaurants')
      .select('id, name, category, logo_url')
      .ilike('name', keyword);

    if (restaurantError) {
      console.error('❌ Restaurant search error:', restaurantError);
    } else {
      console.log('✅ Matched restaurants by name:', matchedRestaurants);
    }

    // 2. Search menus by menu item name
    const { data: matchedMenus, error: menuError } = await supabase
      .from('menus')
      .select('restaurant_id')
       .or(`name.ilike.${keyword},description.ilike.${keyword},ingredients.ilike.${keyword}`);

    if (menuError) {
      console.error('❌ Menu search error:', menuError);
    } else {
      console.log('✅ Matched menu items:', matchedMenus);
    }

    const menuRestaurantIDs = matchedMenus.map((m) => m.restaurant_id);
    console.log('🧩 Extracted restaurant IDs from matched menus:', menuRestaurantIDs);

    // 3. Combine and deduplicate restaurant IDs
    const combinedIDs = [
      ...(matchedRestaurants || []),
      ...menuRestaurantIDs
        .filter((id) => !matchedRestaurants.find((r) => r.id === id))
        .map((id) => ({ id }))
    ];
    console.log('🔄 Combined unique results:', combinedIDs);

    // 4. Fetch full restaurant data for menu-linked matches
    const { data: fullData, error: fetchError } = await supabase
      .from('restaurants')
      .select('id, name, category, logo_url')
      .in('id', combinedIDs.map((r) => r.id));

    if (fetchError) {
      console.error('❌ Fetch fullData error:', fetchError);
    } else {
      console.log('📦 Final restaurant data:', fullData);
    }

    setSearchResults(fullData || []);
    setIsSearching(true);
    setSelectedCategory(null);
  } catch (err) {
    console.error('🔥 Search function exception:', err.message);
    setSearchResults([]);
  }
};



  const categories = [
    { emoji: '🍰', label: 'Desserts' },
    { emoji: '🍝', label: 'Western' },
    { emoji: '🥪', label: 'Sandwiches' },
    { emoji: '☕', label: 'Coffee & Tea' },
    { emoji: '🍔', label: 'Burgers' },
    { emoji: '🍗', label: 'Chicken' },
    { emoji: '🍛', label: 'Curry' },
    { emoji: '🍣', label: 'Japanese' },
    { emoji: '🥘', label: 'Korean' },
    { emoji: '🥗', label: 'Healthy' },
    { emoji: '🍕', label: 'Pizza' },
    { emoji: '🧋', label: 'Bubble Tea' },
    { emoji: '🌮', label: 'Mexican' },
    { emoji: '🍜', label: 'Ramen' },
    { emoji: '🥟', label: 'Dumplings' },
    { emoji: '🧁', label: 'Bakery' }
  ];

  return (
    <div>
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

     
   {/* ─── Search + Category Section ─── */}
<div className="search-category-section">
  <div className="search-bar-wrapper">
    <input
      type="text"
      className="search-bar"
      placeholder="What are we eating today?"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
    <button className="search-btn" onClick={handleSearch}>🔍</button>
  </div>

  <div className="category-grid">
    {categories.map((item, index) => (
      <div
        key={index}
        className={`category-item ${selectedCategory === item.label ? 'active' : ''}`}
        onClick={() => handleCategorySelect(item.label)}
      >
        <div className="emoji">{item.emoji}</div>
        <div className="label">{item.label}</div>
      </div>
    ))}
  </div>

  {selectedCategory && (
    <div className="filtered-restaurant-section">
      <h3>🍴 Showing: {selectedCategory}</h3>
      <div className="restaurant-grid">
        {filteredRestaurants.map((item) => (
         <div
  key={item.id}
  className="restaurant-tile"
  onClick={() => navigate(`/restaurant/${item.id}`)}
  style={{ cursor: 'pointer' }}
>
  <img
    src={item.logo_url || 'https://via.placeholder.com/200x130'}
    alt={item.name}
  />
  <div className="tile-info">
    <div className="tile-name">{item.name}</div>
    <div className="tile-rating">⭐ {item.rating || 'N/A'}</div>
  </div>
</div>

        ))}
      </div>
    </div>
  )}
 {isSearching && (
  <div className="filtered-restaurant-section">
    <h3>🔎 Search Results for: "{searchQuery}"</h3>
    {searchResults.length > 0 ? (
      <div className="restaurant-grid">
        {searchResults.map((item) => (
          <div key={item.id} className="restaurant-tile">
            <img
              src={item.logo_url || 'https://via.placeholder.com/200x130'}
              alt={item.name}
            />
            <div className="tile-info">
              <div className="tile-name">{item.name}</div>
              <div className="tile-rating">⭐ {item.rating || 'N/A'}</div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p style={{ marginTop: '10px', color: 'gray' }}>
        No matching restaurants found.
      </p>
    )}
  </div>
)}

</div>


      {/* ─── Frequently Visited Section ─── */}
  <div className="frequent-section">
  <h2>📍 Frequently Visited</h2>
  {frequentRestaurants.length > 0 ? (
    <div className="restaurant-grid">
      {frequentRestaurants.map((item, index) => (
        <div
  key={item.id}
  className="restaurant-tile"
  onClick={() => navigate(`/restaurant/${item.id}`)}
  style={{ cursor: 'pointer' }}
>
  <img
    src={item.logo_url || 'https://via.placeholder.com/200x130'}
    alt={item.name}
  />
  <div className="tile-info">
    <div className="tile-name">{item.name}</div>
    <div className="tile-rating">⭐ {item.rating || 'N/A'}</div>
  </div>
</div>

      ))}
    </div>
  ) : (
    <p style={{ color: 'gray', marginTop: '10px' }}>
      You haven't visited any restaurants yet.
    </p>
  )}
</div>

   {/* ─── Suggestion Section ─── */}

<div className="suggestion-section">
  <h2>🎯 Recommended For You</h2>
  {suggestionResults.length > 0 ? (
    <div className="restaurant-grid">
      {suggestionResults.map((item) => (
               <div
  key={item.id}
  className="restaurant-tile"
  onClick={() => navigate(`/restaurant/${item.id}`)}
  style={{ cursor: 'pointer' }}
>
  <img
    src={item.logo_url || 'https://via.placeholder.com/200x130'}
    alt={item.name}
  />
  <div className="tile-info">
    <div className="tile-name">{item.name}</div>
    <div className="tile-rating">⭐ {item.rating || 'N/A'}</div>
  </div>
</div>
      ))}
    </div>
  ) : (
    <p style={{ marginTop: '10px', color: 'gray' }}>
      Please visit your first restaurant and order something to get suggestions.
    </p>
  )}
</div>


 {/* ─── All Restaurants + Filters ─── */}
<div className="all-restaurants-section">
  <div className="all-header">
    <h2>🍽️ All Restaurants</h2>

    <div className="filters">
      {/* Filter Dropdown Only */}
      <div className="dropdown-wrapper">
        <div className="dropdown">
          <button className="filter-btn" onClick={() => setFilterOpen(!filterOpen)}>
            Filters ⚙️
          </button>
          {filterOpen && (
            <div className="filter-panel">
              <div className="filter-tags">
                {['Vegan food', 'Halal food', 'Alcohol Available', 'GOLD Ribbon'].map((tag) => (
                  <button
                    key={tag}
                    className={`tag-btn ${selectedTags.includes(tag) ? 'active' : ''}`}
                    onClick={() =>
                      setSelectedTags((prev) =>
                        prev.includes(tag)
                          ? prev.filter((t) => t !== tag)
                          : [...prev, tag]
                      )
                    }
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="price-slider">
                <label>Price (KRW)</label>
                <input
                  type="range"
                  min="5000"
                  max="20000"
                  step="1000"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                <div className="price-value">{price}+</div>
              </div>

              <button className="apply-btn" onClick={() => setFilterOpen(false)}>Apply</button>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>

  <div className="restaurant-grid">
    {filteredRestaurants.length > 0 ? (
      filteredRestaurants.map((item) => (
       <div
  key={item.id}
  className="restaurant-tile"
  onClick={() => navigate(`/restaurant/${item.id}`)}
  style={{ cursor: 'pointer' }}
>
  <img
    src={item.logo_url || 'https://via.placeholder.com/200x130'}
    alt={item.name}
  />
  <div className="tile-info">
    <div className="tile-name">{item.name}</div>
    <div className="tile-rating">⭐ {item.rating || 'N/A'}</div>
  </div>
</div>

      ))
    ) : (
      <p style={{ color: 'gray' }}>No restaurants match your filters.</p>
    )}
  </div>
</div>

{/* ─── Floating QR Button ─── */}
<button
  className="qr-button"
  onClick={() => navigate('/scan-qr')}
>
  📷 Scan Restaurant QR Code
</button>

    </div>
  );
}
