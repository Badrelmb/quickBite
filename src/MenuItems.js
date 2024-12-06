import React from 'react';

function MenuItems({ menuData, selectedCategory, onAddToOrder }) {
  const filteredMenu = selectedCategory === 'All'
    ? menuData
    : menuData.filter((item) => item.category === selectedCategory);

  return (
    <div className="menu-items-container">
      {filteredMenu.map((item) => (
        <div key={item.id} className="menu-item">
          <h3>{item.name}</h3>
            <img src={item.image} alt={item.name} className="menu-item-image" />
          <p>{item.description}</p>
          <p>${item.price.toFixed(2)}</p>
          <button onClick={() => onAddToOrder(item)}>Add to Order</button>
        </div>
      ))}
    </div>
  );
}

export default MenuItems;
