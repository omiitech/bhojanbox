import React, { useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircleIcon, XMarkIcon, ClockIcon, TruckIcon, HomeIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

export default function OrderSuccess() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  // Mock order data - in a real app, this would come from an API
  const order = {
    id: orderId,
    date: new Date().toLocaleDateString(),
    estimatedDelivery: new Date(Date.now() + 60 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    items: [
      { id: 1, name: 'Margherita Pizza', quantity: 1, price: 12.99 },
      { id: 2, name: 'Garlic Bread', quantity: 2, price: 4.99 },
    ],
    subtotal: 22.97,
    tax: 2.30,
    deliveryFee: 3.99,
    total: 29.26,
    status: 'preparing', // preparing, on-the-way, delivered
    deliveryAddress: '123 Main St, Apt 4B, New York, NY 10001',
    paymentMethod: 'Visa ending in 4242',
  };

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  const handleTrackOrder = () => {
    // In a real app, this would navigate to an order tracking page
    console.log('Track order:', orderId);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case 'on-the-way':
        return <TruckIcon className="h-6 w-6 text-blue-500" />;
      case 'preparing':
      default:
        return <ClockIcon className="h-6 w-6 text-yellow-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'on-the-way':
        return 'On the way';
      case 'preparing':
      default:
        return 'Preparing your order';
    }
  };

  const getNextSteps = (status) => {
    switch (status) {
      case 'preparing':
        return [
          { text: 'Your order is being prepared', completed: true },
          { text: 'Out for delivery', completed: false },
          { text: 'Delivered', completed: false },
        ];
      case 'on-the-way':
        return [
          { text: 'Your order is being prepared', completed: true },
          { text: 'Out for delivery', completed: true },
          { text: 'Delivered', completed: false },
        ];
      case 'delivered':
      default:
        return [
          { text: 'Your order is being prepared', completed: true },
          { text: 'Out for delivery', completed: true },
          { text: 'Delivered', completed: true },
        ];
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <CheckCircleIcon className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="mt-4 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Order Confirmed!
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Thank you for your order #{order.id}
          </p>
          <p className="mt-2 text-gray-500">
            We've sent a confirmation email with your order details.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mt-10 bg-white shadow overflow-hidden sm:rounded-lg"
        >
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-lg leading-6 font-medium text-gray-900">
              Order Status
            </h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {getStatusIcon(order.status)}
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">
                  {getStatusText(order.status)}
                </h3>
                <p className="text-sm text-gray-500">
                  Estimated delivery by {order.estimatedDelivery}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <div className="overflow-hidden">
                <div className="relative">
                  <div className="hidden sm:block">
                    <div className="absolute top-0 left-0 h-0.5 w-full bg-gray-200"></div>
                    <div 
                      className="absolute top-0 left-0 h-0.5 bg-green-500 transition-all duration-500 ease-in-out"
                      style={{
                        width: order.status === 'preparing' ? '33%' : 
                               order.status === 'on-the-way' ? '66%' : '100%'
                      }}
                    ></div>
                  </div>
                  <ul className="relative flex justify-between text-sm">
                    {getNextSteps(order.status).map((step, index) => (
                      <li key={index} className="text-center">
                        <div className="flex flex-col items-center">
                          <span className={`flex items-center justify-center h-8 w-8 rounded-full ${step.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'} text-sm font-medium`}>
                            {step.completed ? (
                              <CheckCircleIcon className="h-5 w-5" />
                            ) : (
                              index + 1
                            )}
                          </span>
                          <span className={`mt-2 text-xs font-medium ${step.completed ? 'text-green-600' : 'text-gray-500'}`}>
                            {step.text}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={handleTrackOrder}
                className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <TruckIcon className="h-5 w-5 mr-2" />
                Track Order
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg"
        >
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h2 className="text-lg leading-6 font-medium text-gray-900">
              Order Summary
            </h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <ul className="divide-y divide-gray-200">
              {order.items.map((item) => (
                <li key={item.id} className="py-4 flex justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded-md overflow-hidden">
                      <img
                        src={`https://source.unsplash.com/random/100x100/?food,${item.name.split(' ').join(',')}`}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>

            <dl className="mt-6 border-t border-gray-200 pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900">${order.subtotal.toFixed(2)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Tax</dt>
                <dd className="text-sm font-medium text-gray-900">${order.tax.toFixed(2)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Delivery Fee</dt>
                <dd className="text-sm font-medium text-gray-900">${order.deliveryFee.toFixed(2)}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <dt className="text-base font-medium text-gray-900">Total</dt>
                <dd className="text-base font-medium text-gray-900">${order.total.toFixed(2)}</dd>
              </div>
            </dl>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h2 className="text-lg leading-6 font-medium text-gray-900">
                Delivery Address
              </h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <p className="text-sm text-gray-700">{order.deliveryAddress}</p>
            </div>
          </div>

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
              <h2 className="text-lg leading-6 font-medium text-gray-900">
                Payment Method
              </h2>
            </div>
            <div className="px-4 py-5 sm:p-6">
              <p className="text-sm text-gray-700">{order.paymentMethod}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 flex flex-col sm:flex-row justify-center gap-4"
        >
          <Link
            to="/menu"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ShoppingBagIcon className="h-5 w-5 mr-2" />
            Continue Shopping
          </Link>
          <Link
            to="/orders"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            View Order History
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
