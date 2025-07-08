// src/pages/Menu.jsx
import React, { useEffect, useState } from 'react';
import FoodItemCard from '../components/FoodItemCard';
import { menuAPI } from '../services/api';

const Menu = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await menuAPI.getMenuItems();
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };
    
    fetchMenu();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center text-orange-600">📋 Our Menu</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map(item => (
          <FoodItemCard key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
};

export default Menu;
