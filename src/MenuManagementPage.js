import React, { useState } from 'react';
import './MenuManagementPage.css'; // Import your custom CSS
import './restaurantManagementPage.css';  // Import the CSS file
import logo from './logo_transparent.png'; // Assuming logo image
import { useNavigate } from 'react-router-dom';

function MenuManagement() {
  const [menus, setMenus] = useState([]); // Array to store menu items
  const [showForm, setShowForm] = useState(false); // To toggle form visibility
  const [currentMenuIndex, setCurrentMenuIndex] = useState(null); // Index for editing menu
  const [menuData, setMenuData] = useState({
    name: '',
    image: null,
    category: 'Salads',
    ingredients: '',
    description: ''
  });

  const navigate = useNavigate();
  const restaurantName = "Your Restaurant Name";
  const userID = "USER123"; // Example user ID

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setMenuData({
      ...menuData,
      [name]: files ? files[0] : value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentMenuIndex !== null) {
      // Update existing menu
      const updatedMenus = [...menus];
      updatedMenus[currentMenuIndex] = menuData;
      setMenus(updatedMenus);
    } else {
      // Add new menu
      setMenus([...menus, menuData]);
    }
    resetForm();
  };

  // Reset form and hide
  const resetForm = () => {
    setMenuData({ name: '', image: null, category: 'Salads', ingredients: '', description: '' });
    setCurrentMenuIndex(null);
    setShowForm(false);
  };

  // Handle edit menu
  const handleEdit = (index) => {
    setCurrentMenuIndex(index);
    setMenuData(menus[index]);
    setShowForm(true);
  };

  // Handle delete menu
  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this menu?')) {
      setMenus(menus.filter((_, i) => i !== index));
    }
  };
  // Handle toggle Sold Out / Available
  const toggleStatus = (index) => {
    const updatedMenus = [...menus];
    updatedMenus[index].status = updatedMenus[index].status === 'Sold Out' ? 'Available' : 'Sold Out';
    setMenus(updatedMenus);
  };
  const handleLogout = () => {
    // Clear any user session data here
    navigate('/'); // Redirect to login page
  };

  return (
    <div className="menu-management-page">
      {/* Header */}
      <header className="register-header d-flex justify-content-between align-items-center py-3 px-4">
        <img src={logo} alt="QuickBite Logo" className="logo" />
        <div className="user-section d-flex align-items-center">
          <div className="user-id mr-3">{userID}</div>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="main-content text-center">
        <h1>{restaurantName}</h1>

        {/* Add Menu Button */}
        <button className="btn btn-primary mb-3 custom-add-menu-btn" onClick={() => setShowForm(true)}>
          Add Menu
        </button>

        {/* Slide-in Form for Menu */}
        {showForm && (
          <div className="menu-form slide-in">
            <div className="form-header d-flex justify-content-between align-items-center mb-4">
              <h2>Register Menu Item</h2>
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

        {/* Display Menu Items */}
        <div className="menu-items d-flex flex-wrap justify-content-center">
          {menus.map((menu, index) => (
            <div key={index} className="menu-item card p-3">
              {menu.image && <img src={URL.createObjectURL(menu.image)} alt={menu.name} className="card-img-top" />}
              <div className="card-body text-center">
                <h5 className="card-title">{menu.name}</h5>
                <p className="card-text">{menu.category}</p>
                <div className="menu-actions">
                  <button className="btn btn-warning btn-sm mr-2" onClick={() => handleEdit(index)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(index)}>Delete</button>
                  <button
                    className={`btn btn-sm ${menu.status === 'Sold Out' ? 'btn-secondary' : 'btn-success'}`}
                    onClick={() => toggleStatus(index)}
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