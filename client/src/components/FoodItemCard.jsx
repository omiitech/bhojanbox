// src/components/FoodItemCard.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { addToCart } from '../features/cart/cartSlice';
import { motion } from 'framer-motion';

const FoodItemCard = ({ item }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const { items: cartItems } = useSelector((state) => state.cart);

  const isInCart = cartItems.some((cartItem) => cartItem._id === item._id);
  const cartItem = cartItems.find((cartItem) => cartItem._id === item._id);

  const handleAddToCart = () => {
    dispatch(addToCart({ itemId: item._id, quantity }));
  };

  const incrementQuantity = (e) => {
    e.stopPropagation();
    setQuantity((prev) => Math.min(prev + 1, 10));
  };

  const decrementQuantity = (e) => {
    e.stopPropagation();
    setQuantity((prev) => Math.max(prev - 1, 1));
  };

  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-300"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <img 
          src={item.image || 'https://via.placeholder.com/300x200?text=Food+Image'} 
          alt={item.name} 
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300x200?text=Food+Image';
          }}
        />
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsFavorite(!isFavorite);
          }}
          className="absolute top-3 right-3 p-2 bg-white/80 rounded-full backdrop-blur-sm hover:bg-white"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? (
            <HeartIconSolid className="h-6 w-6 text-red-500" />
          ) : (
            <HeartIconOutline className="h-6 w-6 text-gray-400 hover:text-red-500" />
          )}
        </button>
        {item.isVegetarian !== undefined && (
          <span className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${
            item.isVegetarian ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {item.isVegetarian ? 'Veg' : 'Non-Veg'}
          </span>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{item.name}</h3>
          <span className="bg-amber-100 text-amber-800 text-sm font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap ml-2">

Rs{item.price ? Number(item.price).toFixed(2) : '0.00'}
          </span>
        </div>
        
        {item.category && (
          <span className="inline-block mt-1 text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
            {item.category}
          </span>
        )}
        
        <p className="mt-2 text-gray-600 text-sm line-clamp-2">{item.description}</p>
        
        <div className="mt-4 flex items-center justify-between">
          {isInCart ? (
            <div className="flex items-center space-x-2">
              <button 
                onClick={decrementQuantity}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="w-8 text-center">{cartItem?.quantity || 1}</span>
              <button 
                onClick={incrementQuantity}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          ) : (
            <div className="w-24">
              <button 
                onClick={handleAddToCart}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Add to Cart
              </button>
            </div>
          )}
          
          {item.rating !== undefined && (
            <div className="flex items-center text-amber-500">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="ml-1 text-sm font-medium text-gray-700">
                {item.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FoodItemCard;
