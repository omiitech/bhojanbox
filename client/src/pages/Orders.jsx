import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  XCircleIcon, 
  TruckIcon, 
  ChevronRightIcon 
} from '@heroicons/react/24/outline';

// Mock data - in a real app, this would come from an API
const mockOrders = [
  {
    id: 'ORD-1001',
    date: '2023-05-15',
    status: 'delivered',
    items: [
      { id: 1, name: 'Margherita Pizza', quantity: 1, price: 12.99 },
      { id: 2, name: 'Garlic Bread', quantity: 2, price: 4.99 },
    ],
    total: 29.26,
    deliveryAddress: '123 Main St, Apt 4B, New York, NY 10001',
  },
  {
    id: 'ORD-1002',
    date: '2023-05-10',
    status: 'on-the-way',
    items: [
      { id: 3, name: 'Pepperoni Pizza', quantity: 1, price: 14.99 },
      { id: 4, name: 'Caesar Salad', quantity: 1, price: 8.99 },
    ],
    total: 31.48,
    deliveryAddress: '123 Main St, Apt 4B, New York, NY 10001',
  },
  {
    id: 'ORD-1003',
    date: '2023-05-05',
    status: 'cancelled',
    items: [
      { id: 5, name: 'Veggie Pizza', quantity: 1, price: 13.99 },
      { id: 6, name: 'Mozzarella Sticks', quantity: 1, price: 6.99 },
    ],
    total: 28.48,
    deliveryAddress: '123 Main St, Apt 4B, New York, NY 10001',
  },
];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Simulate API call
    const fetchOrders = async () => {
      try {
        // In a real app, you would fetch orders from your API
        // const response = await api.get('/orders');
        // setOrders(response.data);
        
        // For now, use mock data
        setTimeout(() => {
          setOrders(mockOrders);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircleIcon className="h-4 w-4 mr-1" />
            Delivered
          </span>
        );
      case 'on-the-way':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <TruckIcon className="h-4 w-4 mr-1" />
            On the way
          </span>
        );
      case 'preparing':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <ClockIcon className="h-4 w-4 mr-1" />
            Preparing
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircleIcon className="h-4 w-4 mr-1" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600">Loading your orders...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Order History
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            View your past and current orders
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mt-10"
        >
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto pb-4">
              <button
                onClick={() => setActiveTab('all')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'all'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                All Orders
              </button>
              <button
                onClick={() => setActiveTab('preparing')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'preparing'
                    ? 'border-yellow-500 text-yellow-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Preparing
              </button>
              <button
                onClick={() => setActiveTab('on-the-way')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'on-the-way'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                On the Way
              </button>
              <button
                onClick={() => setActiveTab('delivered')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'delivered'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Delivered
              </button>
              <button
                onClick={() => setActiveTab('cancelled')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'cancelled'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Cancelled
              </button>
            </nav>
          </div>

          {/* Order List */}
          <div className="mt-8">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No orders found</h3>
                <p className="mt-1 text-gray-500">
                  {activeTab === 'all' 
                    ? 'You haven\'t placed any orders yet.' 
                    : `You don't have any ${activeTab} orders.`}
                </p>
                <div className="mt-6">
                  <Link
                    to="/menu"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Start Ordering
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <li key={order.id}>
                      <Link
                        to={`/orders/${order.id}`}
                        className="block hover:bg-gray-50"
                      >
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-indigo-600 truncate">
                              Order #{order.id}
                            </p>
                            <div className="ml-2 flex-shrink-0 flex">
                              {getStatusBadge(order.status)}
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                <span className="font-medium">
                                  {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                </span>
                                <span className="mx-1">•</span>
                                <span>{formatDate(order.date)}</span>
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <span className="font-medium">
                                ${order.total.toFixed(2)}
                              </span>
                              <ChevronRightIcon 
                                className="ml-2 h-5 w-5 text-gray-400" 
                                aria-hidden="true" 
                              />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
