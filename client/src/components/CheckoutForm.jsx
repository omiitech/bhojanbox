import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-hot-toast';

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [cardError, setCardError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet
      return;
    }

    setProcessing(true);
    setCardError(null);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (error) {
        console.error('Payment error:', error);
        setCardError(error.message);
        toast.error(error.message || 'Payment failed');
      } else {
        console.log('PaymentMethod:', paymentMethod);
        // Handle successful payment method creation
        // You would typically send the paymentMethod.id to your server
        // to complete the payment
        toast.success('Payment method added successfully');
      }
    } catch (error) {
      console.error('Error:', error);
      setCardError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border border-gray-300 rounded-md p-3">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      
      {cardError && (
        <div className="text-red-600 text-sm mt-2">{cardError}</div>
      )}
      
      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
          !stripe || processing
            ? 'bg-indigo-300 cursor-not-allowed'
            : 'bg-indigo-600 hover:bg-indigo-700'
        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
      >
        {processing ? 'Processing...' : 'Save Card'}
      </button>
      
      <p className="text-xs text-gray-500 mt-2">
        Your payment details are secured with 256-bit SSL encryption
      </p>
    </form>
  );
};

export default CheckoutForm;
