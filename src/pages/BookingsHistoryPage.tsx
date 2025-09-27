import React, { useState, useEffect } from 'react';

interface Booking {
  id: string;
  movieTitle: string;
  showtime: string;
  seats: string[];
  totalAmount: number;
  bookingDate: string;
  status: 'confirmed' | 'cancelled' | 'completed';
}

const BookingsHistoryPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call to fetch bookings history
    const fetchBookings = async () => {
      try {
        // Mock data for demonstration
        const mockBookings: Booking[] = [
          {
            id: '1',
            movieTitle: 'Avatar: The Way of Water',
            showtime: '2024-01-15 19:30',
            seats: ['A1', 'A2'],
            totalAmount: 25.00,
            bookingDate: '2024-01-10',
            status: 'completed'
          },
          {
            id: '2',
            movieTitle: 'Top Gun: Maverick',
            showtime: '2024-01-20 21:00',
            seats: ['B5'],
            totalAmount: 12.50,
            bookingDate: '2024-01-18',
            status: 'confirmed'
          }
        ];

        setTimeout(() => {
          setBookings(mockBookings);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      case 'completed':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Bookings History</h1>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Bookings History</h1>
        
        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">No bookings found</div>
            <p className="text-gray-400 mt-2">Your booking history will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {booking.movieTitle}
                    </h2>
                    <div className="space-y-1 text-gray-600">
                      <p><span className="font-medium">Showtime:</span> {new Date(booking.showtime).toLocaleString()}</p>
                      <p><span className="font-medium">Seats:</span> {booking.seats.join(', ')}</p>
                      <p><span className="font-medium">Booking Date:</span> {new Date(booking.bookingDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium mb-2 ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      ${booking.totalAmount.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsHistoryPage;