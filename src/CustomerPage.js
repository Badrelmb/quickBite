import React, { useState } from 'react';
import CategoriesSidebar from './CategoriesSidebar';
import MenuItems from './MenuItems';
import OrderSummary from './OrderSummary';
import './CustomerPage.css'; 

//Menu image files
import burger from './img/beefburger.jpeg';
import frenchfries from './img/frenchfries.jpg';
import cheesecake from './img/Cheesecake.jpg';
import lemonade from './img/lemonade.jpg';
import chocolatecake from './img/chocolatecake.jpeg';

const menuData = [
  { id: 1, name: 'Burger', price: 8.99, category: 'Main Course', description: 'Delicious beef burger',  image: burger },
  { id: 2, name: 'Fries', price: 3.49, category: 'Appetizers', description: 'Crispy golden fries', image: frenchfries },
  { id: 3, name: 'Cheesecake', price: 5.99, category: 'Desserts', description: 'Creamy cheesecake',  image: cheesecake },
  { id: 4, name: 'Lemonade', price: 2.99, category: 'Drinks', description: 'Refreshing lemonade', image: lemonade },
  { id: 5, name: 'Caesar Salad', price: 7.49, category: 'Appetizers', description: 'Fresh romaine lettuce with Caesar dressing', image: 'https://via.placeholder.com/150' },
  { id: 6, name: 'Grilled Salmon', price: 15.99, category: 'Main Course', description: 'Perfectly grilled salmon with a side of vegetables' ,  image: 'https://via.placeholder.com/150'},
  { id: 7, name: 'Spaghetti Carbonara', price: 12.99, category: 'Main Course', description: 'Creamy spaghetti with pancetta and Parmesan',  image: 'https://via.placeholder.com/150' },
  { id: 8, name: 'Chocolate Cake', price: 6.49, category: 'Desserts', description: 'Rich and moist chocolate cake' , image: chocolatecake},
  { id: 9, name: 'Iced Coffee', price: 3.99, category: 'Drinks', description: 'Cold and refreshing iced coffee',  image: 'https://via.placeholder.com/150' },
  { id: 10, name: 'Margarita Pizza', price: 9.99, category: 'Main Course', description: 'Classic pizza with fresh mozzarella and basil',  image: 'https://via.placeholder.com/150' },
  { id: 11, name: 'Chicken Wings', price: 8.49, category: 'Appetizers', description: 'Spicy chicken wings served with ranch dip',  image: 'https://via.placeholder.com/150' },
  { id: 12, name: 'Vegetable Stir-Fry', price: 10.99, category: 'Main Course', description: 'Healthy and colorful stir-fried vegetables',  image: 'https://via.placeholder.com/150' },
  { id: 13, name: 'Apple Pie', price: 4.99, category: 'Desserts', description: 'Homemade apple pie with a flaky crust',  image: 'https://via.placeholder.com/150' },
  { id: 14, name: 'Smoothie Bowl', price: 5.49, category: 'Desserts', description: 'Healthy smoothie bowl topped with granola and fruits',  image: 'https://via.placeholder.com/150' },
  { id: 15, name: 'Mango Juice', price: 3.49, category: 'Drinks', description: 'Freshly squeezed mango juice',  image: 'https://via.placeholder.com/150' },
];

function CustomerPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [order, setOrder] = useState([]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleAddToOrder = (menuItem) => {
    setOrder((prevOrder) => {
      const existingItem = prevOrder.find((item) => item.id === menuItem.id);
      if (existingItem) {
        return prevOrder.map((item) =>
          item.id === menuItem.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevOrder, { ...menuItem, quantity: 1 }];
      }
    });
  };

  return (
    <div className="customer-page">
      <div className="sidebar">
        <CategoriesSidebar
          categories={['All', 'Appetizers', 'Main Course', 'Desserts', 'Drinks']}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />
      </div>
      <div className="menu-items">
        <MenuItems
          menuData={menuData}
          selectedCategory={selectedCategory}
          onAddToOrder={handleAddToOrder}
        />
      </div>
      <div className="order-summary">
        <OrderSummary order={order} />
      </div>
    </div>
  );
}

export default CustomerPage;
