import React, { useEffect, useState } from 'react';
import './MenuManagementPage.css';
import './restaurantManagementPage.css';
import logo from './logo_transparent.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from './supabaseClient';

function MenuManagement() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedRestaurant = location.state?.selectedRestaurant;

  const [menus, setMenus] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentMenuId, setCurrentMenuId] = useState(null);
  const [menuData, setMenuData] = useState({
    name: '',
    image: null,
    category: 'Salads',
    ingredients: '',
    description: ''
  });

  useEffect(() => {
    if (!selectedRestaurant) {
      navigate('/restaurant-management');
      return;
    }
    fetchMenus();
  }, [selectedRestaurant]);

  const fetchMenus = async () => {
    const { data, error } = await supabase
      .from('menus')
      .select('*')
      .eq('restaurant_id', selectedRestaurant.id);

    if (error) {
      console.error('Error fetching menus:', error);
    } else {
      setMenus(data);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setMenuData({
      ...menuData,
      [name]: files ? files[0] : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let imageUrl = 'https://via.placeholder.com/400x300?text=Menu+Item';

    if (menuData.image) {
      const fileExt = menuData.image.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('menu-images')
        .upload(fileName, menuData.image);

      if (uploadError) {
        alert('Image upload failed');
        return;
      }

      const { data: urlData } = supabase.storage
        .from('menu-images')
        .getPublicUrl(fileName);
      imageUrl = urlData.publicUrl;
    }

    if (currentMenuId) {
      // Update
      const { error } = await supabase
        .from('menus')
        .update({
          name: menuData.name,
          category: menuData.category,
          ingredients: menuData.ingredients,
          description: menuData.description,
          ...(imageUrl && { image_url: imageUrl })
        })
        .eq('id', currentMenuId);
      if (error) alert('Update failed');
    } else {
      // Insert
      const { error } = await supabase
        .from('menus')
        .insert([{
          restaurant_id: selectedRestaurant.id,
          name: menuData.name,
          image_url: imageUrl,
          category: menuData.category,
          ingredients: menuData.ingredients,
          description: menuData.description
        }]);
      if (error) alert('Insert failed');
    }

    resetForm();
    fetchMenus();
  };

  const resetForm = () => {
    setMenuData({ name: '', image: null, category: 'Salads', ingredients: '', description: '' });
    setCurrentMenuId(null);
    setShowForm(false);
  };

  const handleEdit = (menu) => {
    setCurrentMenuId(menu.id);
    setMenuData({
      name: menu.name,
      image: null, // No need to refetch image
      category: menu.category,
      ingredients: menu.ingredients,
      description: menu.description
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this menu?')) {
      await supabase.from('menus').delete().eq('id', id);
      fetchMenus();
    }
  };

  const toggleStatus = async (menu) => {
    const newStatus = menu.status === 'Sold Out' ? 'Available' : 'Sold Out';
    await supabase.from('menus').update({ status: newStatus }).eq('id', menu.id);
    fetchMenus();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();     
    setShowCover(true);                
    navigate('/');                     
  };
  

  return (
    <div className="menu-management-page">
      <header className="register-header d-flex justify-content-between align-items-center py-3 px-4">
        <img src={logo} alt="QuickBite Logo" className="logo" />
        <div className="user-section d-flex align-items-center">
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="main-content text-center">
        <div className="back-button" onClick={() => navigate('/restaurant-management')}>
          ← Back
        </div>

        <h1>{selectedRestaurant?.name}</h1>

        <button className="btn btn-primary mb-3 custom-add-menu-btn" onClick={() => setShowForm(true)}>
          Add Menu
        </button>

        {showForm && (
          <div className="menu-form slide-in">
            <div className="form-header d-flex justify-content-between align-items-center mb-4">
              <h2>{currentMenuId ? 'Edit Menu Item' : 'Register Menu Item'}</h2>
              <button className="close-btn" onClick={resetForm}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={menuData.name}
                  onChange={handleChange}
                  placeholder="Menu Name"
                  required
                />
              </div>
              <div className="form-group">
                <input type="file" name="image" className="form-control-file" onChange={handleChange} />
              </div>
              <div className="form-group">
                <select name="category" className="form-control" value={menuData.category} onChange={handleChange}>
                  <option value="Salads">Salads</option>
                  <option value="Main Dish">Main Dish</option>
                  <option value="Side">Side</option>
                  <option value="Drinks">Drinks</option>
                  <option value="Desserts">Desserts</option>
                </select>
              </div>
              <div className="form-group">
                <textarea
                  name="ingredients"
                  className="form-control"
                  value={menuData.ingredients}
                  onChange={handleChange}
                  placeholder="Ingredients"
                />
              </div>
              <div className="form-group">
                <textarea
                  name="description"
                  className="form-control"
                  value={menuData.description}
                  onChange={handleChange}
                  placeholder="Description"
                />
              </div>
              <button type="submit" className="btn btn-Slide w-100">Submit</button>
            </form>
          </div>
        )}

        <div className="menu-items d-flex flex-wrap justify-content-center">
          {menus.map((menu, index) => (
            <div key={menu.id} className="menu-item card p-3">
              {menu.image_url && <img src={menu.image_url} alt={menu.name} className="card-img-top" />}
              <div className="card-body text-center">
                <h5 className="card-title">{menu.name}</h5>
                <p className="card-text">{menu.category}</p>
                <div className="menu-actions">
                  <button className="btn btn-warning btn-sm mr-2" onClick={() => handleEdit(menu)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(menu.id)}>Delete</button>
                  <button
                    className={`btn btn-sm ${menu.status === 'Sold Out' ? 'btn-secondary' : 'btn-success'}`}
                    onClick={() => toggleStatus(menu)}
                  >
                    {menu.status === 'Sold Out' ? 'Available' : 'Sold Out'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default MenuManagement;
