import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'googlepay' | 'applepay';
  name: string;
  icon: string;
  details?: string;
}

interface BookingDetails {
  movieTitle: string;
  showtime: string;
  theater: string;
  seats: string[];
  ticketPrice: number;
  fees: number;
  total: number;
}

interface CardDetails {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardholderName: string;
}

const PaymentsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: ''
  });
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);
  const [processing, setProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      type: 'card',
      name: 'Credit/Debit Card',
      icon: '💳',
      details: 'Visa, Mastercard, American Express'
    },
    {
      id: 'paypal',
      type: 'paypal',
      name: 'PayPal',
      icon: '🔵',
      details: 'Pay with your PayPal account'
    },
    {
      id: 'googlepay',
      type: 'googlepay',
      name: 'Google Pay',
      icon: '🟢',
      details: 'Quick and secure payment'
    },
    {
      id: 'applepay',
      type: 'applepay',
      name: 'Apple Pay',
      icon: '⚫',
      details: 'Pay with Touch ID or Face ID'
    }
  ];

  useEffect(() => {
    // Get booking details from navigation state or simulate
    const navigationState = location.state as any;
    
    let mockBookingDetails: BookingDetails;
    
    if (navigationState?.selectedSeats && navigationState?.showDetails) {
      // Use real data from seat selection
      const { selectedSeats, showDetails } = navigationState;
      mockBookingDetails = {
        movieTitle: showDetails.movieTitle,
        showtime: showDetails.showtime,
        theater: showDetails.theater,
        seats: selectedSeats,
        ticketPrice: 15.00,
        fees: 2.50,
        total: (selectedSeats.length * 15.00) + 2.50
      };
    } else {
      // Fallback mock data
      mockBookingDetails = {
        movieTitle: 'Avatar: The Way of Water',
        showtime: 'Today, 7:30 PM',
        theater: 'Cinema Central Hall 1',
        seats: ['A5', 'A6'],
        ticketPrice: 15.00,
        fees: 2.50,
        total: 32.50
      };
    }

    setBookingDetails(mockBookingDetails);
    setSelectedPaymentMethod('card');
  }, [location.state]);

  const handleCardInputChange = (field: keyof CardDetails, value: string) => {
    setCardDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    // Add spaces every 4 digits
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod || !bookingDetails) return;

    setProcessing(true);

    // Simulate payment processing
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      setPaymentComplete(true);
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setProcessing(false);
    }
  };

  const isFormValid = () => {
    if (selectedPaymentMethod === 'card') {
      return cardDetails.cardNumber.replace(/\s/g, '').length >= 13 &&
             cardDetails.expiryMonth &&
             cardDetails.expiryYear &&
             cardDetails.cvv.length >= 3 &&
             cardDetails.cardholderName.trim().length > 0;
    }
    return selectedPaymentMethod !== '';
  };

  if (paymentComplete) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your booking for <strong>{bookingDetails?.movieTitle}</strong> has been confirmed.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">Booking Reference:</p>
            <p className="text-lg font-mono font-bold text-gray-900">BK-{Date.now().toString().slice(-8)}</p>
          </div>
          <button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            onClick={() => navigate('/bookings')}
          >
            View My Bookings
          </button>
        </div>
      </div>
    );
  }

  if (!bookingDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">Complete Your Payment</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
                {/* Payment Method Selection */}
                <div className="mb-6 sm:mb-8">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Select Payment Method</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        onClick={() => setSelectedPaymentMethod(method.id)}
                        className={`border-2 rounded-lg p-3 sm:p-4 cursor-pointer transition-all ${
                          selectedPaymentMethod === method.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl sm:text-2xl">{method.icon}</span>
                          <div>
                            <div className="font-semibold text-gray-900 text-sm sm:text-base">{method.name}</div>
                            <div className="text-xs sm:text-sm text-gray-600">{method.details}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Details Form */}
                {selectedPaymentMethod === 'card' && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Card Details</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cardholder Name *
                        </label>
                        <input
                          type="text"
                          value={cardDetails.cardholderName}
                          onChange={(e) => handleCardInputChange('cardholderName', e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Card Number *
                        </label>
                        <input
                          type="text"
                          value={cardDetails.cardNumber}
                          onChange={(e) => handleCardInputChange('cardNumber', formatCardNumber(e.target.value))}
                          maxLength={19}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Month *
                          </label>
                          <select
                            value={cardDetails.expiryMonth}
                            onChange={(e) => handleCardInputChange('expiryMonth', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">MM</option>
                            {Array.from({length: 12}, (_, i) => i + 1).map(month => (
                              <option key={month} value={month.toString().padStart(2, '0')}>
                                {month.toString().padStart(2, '0')}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Year *
                          </label>
                          <select
                            value={cardDetails.expiryYear}
                            onChange={(e) => handleCardInputChange('expiryYear', e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="">YYYY</option>
                            {Array.from({length: 10}, (_, i) => new Date().getFullYear() + i).map(year => (
                              <option key={year} value={year.toString()}>
                                {year}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV *
                          </label>
                          <input
                            type="text"
                            value={cardDetails.cvv}
                            onChange={(e) => handleCardInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                            placeholder="123"
                            maxLength={4}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Other Payment Methods */}
                {selectedPaymentMethod !== 'card' && selectedPaymentMethod !== '' && (
                  <div className="mb-8">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800">
                        You will be redirected to {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name} to complete your payment.
                      </p>
                    </div>
                  </div>
                )}

                {/* Terms and Conditions */}
                <div className="mb-6">
                  <label className="flex items-start gap-3">
                    <input type="checkbox" className="mt-1" />
                    <span className="text-sm text-gray-600">
                      I agree to the <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                    </span>
                  </label>
                </div>

                {/* Pay Button */}
                <button
                  onClick={handlePayment}
                  disabled={!isFormValid() || processing}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all ${
                    !isFormValid() || processing
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {processing ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing Payment...
                    </div>
                  ) : (
                    `Pay $${bookingDetails.total.toFixed(2)}`
                  )}
                </button>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div>
                    <div className="font-semibold text-gray-900">{bookingDetails.movieTitle}</div>
                    <div className="text-sm text-gray-600">{bookingDetails.showtime}</div>
                    <div className="text-sm text-gray-600">{bookingDetails.theater}</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-600">Seats</div>
                    <div className="font-semibold text-gray-900">{bookingDetails.seats.join(', ')}</div>
                  </div>
                </div>

                <hr className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tickets ({bookingDetails.seats.length}x)</span>
                    <span>${(bookingDetails.ticketPrice * bookingDetails.seats.length).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking Fees</span>
                    <span>${bookingDetails.fees.toFixed(2)}</span>
                  </div>
                </div>

                <hr className="my-4" />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${bookingDetails.total.toFixed(2)}</span>
                </div>

                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 text-green-700">
                    <span>🔒</span>
                    <span className="text-sm">Your payment is secured with 256-bit SSL encryption</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;