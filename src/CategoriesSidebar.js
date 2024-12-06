import React from 'react';

function CategoriesSidebar({ categories, selectedCategory, onCategoryChange }) {
  return (
    <ul className="categories-sidebar">
      {categories.map((category) => (
        <li
          key={category}
          className={category === selectedCategory ? 'active' : ''}
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </li>
      ))}
    </ul>
  );
}

export default CategoriesSidebar;
