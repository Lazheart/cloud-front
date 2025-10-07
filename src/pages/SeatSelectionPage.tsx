import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Seat {
  id: string;
  row: string;
  number: number;
  status: 'available' | 'occupied' | 'selected' | 'disabled';
  type: 'regular' | 'premium' | 'vip';
  price: number;
}

interface ShowDetails {
  movieTitle: string;
  showtime: string;
  theater: string;
  duration: string;
}

const SeatSelectionPage: React.FC = () => {
  const { showtimeId } = useParams<{ showtimeId: string }>();
  const navigate = useNavigate();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [showDetails, setShowDetails] = useState<ShowDetails | null>(null);
  const [loading, setLoading] = useState(true);

  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const seatsPerRow = 12;

  useEffect(() => {
    // Simulate API calls to fetch show details and seat availability
    const fetchData = async () => {
      try {
        const mockShowDetails: ShowDetails = {
          movieTitle: 'Avatar: The Way of Water',
          showtime: 'Today, 7:30 PM',
          theater: 'Cinema Central Hall 1',
          duration: '3h 12m'
        };

        // Generate seats layout
        const generatedSeats: Seat[] = [];
        
        rows.forEach((row, rowIndex) => {
          for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
            let seatType: 'regular' | 'premium' | 'vip' = 'regular';
            let price = 12.50;
            
            // Premium seats (middle rows, center seats)
            if (rowIndex >= 3 && rowIndex <= 6 && seatNum >= 4 && seatNum <= 9) {
              seatType = 'premium';
              price = 15.00;
            }
            
            // VIP seats (back rows, center seats)
            if (rowIndex >= 7 && seatNum >= 4 && seatNum <= 9) {
              seatType = 'vip';
              price = 18.00;
            }

            // Randomly set some seats as occupied
            let status: Seat['status'] = 'available';
            if (Math.random() < 0.3) {
              status = 'occupied';
            }

            // Disable aisle seats for realism
            if (seatNum === 1 || seatNum === seatsPerRow) {
              if (Math.random() < 0.1) {
                status = 'disabled';
              }
            }

            generatedSeats.push({
              id: `${row}${seatNum}`,
              row,
              number: seatNum,
              status,
              type: seatType,
              price
            });
          }
        });

        setTimeout(() => {
          setShowDetails(mockShowDetails);
          setSeats(generatedSeats);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSeatClick = (seatId: string) => {
    const seat = seats.find(s => s.id === seatId);
    if (!seat || seat.status === 'occupied' || seat.status === 'disabled') return;

    if (selectedSeats.includes(seatId)) {
      // Deselect seat
      setSelectedSeats(prev => prev.filter(id => id !== seatId));
      setSeats(prev => prev.map(s => 
        s.id === seatId ? { ...s, status: 'available' } : s
      ));
    } else {
      // Select seat (limit to 8 seats)
      if (selectedSeats.length < 8) {
        setSelectedSeats(prev => [...prev, seatId]);
        setSeats(prev => prev.map(s => 
          s.id === seatId ? { ...s, status: 'selected' } : s
        ));
      }
    }
  };

  const getSeatColor = (seat: Seat) => {
    switch (seat.status) {
      case 'available':
        switch (seat.type) {
          case 'regular':
            return 'bg-green-200 hover:bg-green-300 border-green-400 cursor-pointer';
          case 'premium':
            return 'bg-blue-200 hover:bg-blue-300 border-blue-400 cursor-pointer';
          case 'vip':
            return 'bg-purple-200 hover:bg-purple-300 border-purple-400 cursor-pointer';
          default:
            return 'bg-green-200 hover:bg-green-300 border-green-400 cursor-pointer';
        }
      case 'selected':
        return 'bg-yellow-400 border-yellow-500 cursor-pointer';
      case 'occupied':
        return 'bg-red-300 border-red-400 cursor-not-allowed opacity-60';
      case 'disabled':
        return 'bg-gray-300 border-gray-400 cursor-not-allowed opacity-40';
      default:
        return 'bg-gray-200 border-gray-300';
    }
  };

  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seatId) => {
      const seat = seats.find(s => s.id === seatId);
      return total + (seat?.price || 0);
    }, 0);
  };

  const handleProceedToPayment = () => {
    if (selectedSeats.length === 0) return;
    
    // Navigate to payment page with selected seats data
    navigate('/payment', { 
      state: { 
        selectedSeats, 
        showDetails,
        showtimeId 
      } 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading seat availability...</p>
        </div>
      </div>
    );
  }

  if (!showDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Show Not Found</h2>
          <p className="text-gray-600">The requested show could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Select Your Seats</h1>
            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 max-w-2xl mx-auto">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{showDetails.movieTitle}</h2>
              <div className="text-gray-600 mt-1 text-sm sm:text-base">
                {showDetails.showtime} • {showDetails.theater} • {showDetails.duration}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 sm:gap-8">
            {/* Seating Chart */}
            <div className="xl:col-span-3">
              <div className="bg-white rounded-lg shadow-lg p-3 sm:p-6">
                {/* Screen */}
                <div className="text-center mb-6 sm:mb-8">
                  <div className="bg-gray-800 text-white py-2 px-4 sm:px-8 rounded-t-lg mx-auto max-w-xs text-sm sm:text-base">
                    SCREEN
                  </div>
                  <div className="h-2 bg-gradient-to-b from-gray-800 to-transparent mx-auto max-w-xs rounded-b-lg"></div>
                </div>

                {/* Seats */}
                <div className="space-y-2 sm:space-y-3 overflow-x-auto">
                  {rows.map((row) => (
                    <div key={row} className="flex justify-center items-center gap-1 sm:gap-2 min-w-max">
                      <div className="w-6 sm:w-8 text-center font-bold text-gray-700 text-sm sm:text-base">{row}</div>
                      <div className="flex gap-1 sm:gap-2">
                        {Array.from({ length: seatsPerRow }, (_, index) => {
                          const seatNum = index + 1;
                          const seatId = `${row}${seatNum}`;
                          const seat = seats.find(s => s.id === seatId);
                          
                          if (!seat) return null;

                          return (
                            <React.Fragment key={seatId}>
                              <button
                                onClick={() => handleSeatClick(seatId)}
                                className={`w-6 h-6 sm:w-8 sm:h-8 border-2 rounded-lg text-xs font-medium transition-all ${getSeatColor(seat)}`}
                                disabled={seat.status === 'occupied' || seat.status === 'disabled'}
                                title={`Seat ${seatId} - ${seat.type} ($${seat.price})`}
                              >
                                {seatNum}
                              </button>
                              {seatNum === 6 && <div className="w-2 sm:w-4"></div>} {/* Aisle gap */}
                            </React.Fragment>
                          );
                        })}
                      </div>
                      <div className="w-6 sm:w-8 text-center font-bold text-gray-700 text-sm sm:text-base">{row}</div>
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="mt-6 sm:mt-8 border-t pt-4 sm:pt-6">
                  <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-200 border border-green-400 rounded"></div>
                      <span>Available ($12.50)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-200 border border-blue-400 rounded"></div>
                      <span>Premium ($15.00)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-purple-200 border border-purple-400 rounded"></div>
                      <span>VIP ($18.00)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-yellow-400 border border-yellow-500 rounded"></div>
                      <span>Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-300 border border-red-400 rounded opacity-60"></div>
                      <span>Occupied</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="xl:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 sticky top-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Booking Summary</h3>
                
                {selectedSeats.length > 0 ? (
                  <div>
                    <div className="space-y-3 mb-6">
                      <div>
                        <div className="text-xs sm:text-sm text-gray-600">Selected Seats</div>
                        <div className="font-semibold text-gray-900 text-sm sm:text-base">
                          {selectedSeats.sort().join(', ')}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs sm:text-sm text-gray-600">Quantity</div>
                        <div className="font-semibold text-gray-900 text-sm sm:text-base">{selectedSeats.length} ticket{selectedSeats.length !== 1 ? 's' : ''}</div>
                      </div>
                    </div>

                    <hr className="my-4" />

                    <div className="space-y-2 mb-4">
                      {selectedSeats.map(seatId => {
                        const seat = seats.find(s => s.id === seatId);
                        return seat ? (
                          <div key={seatId} className="flex justify-between text-xs sm:text-sm">
                            <span>{seat.id} ({seat.type})</span>
                            <span>${seat.price.toFixed(2)}</span>
                          </div>
                        ) : null;
                      })}
                    </div>

                    <hr className="my-4" />

                    <div className="flex justify-between text-base sm:text-lg font-semibold mb-6">
                      <span>Total</span>
                      <span>${getTotalPrice().toFixed(2)}</span>
                    </div>

                    <button
                      onClick={handleProceedToPayment}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors text-sm sm:text-base"
                    >
                      Proceed to Payment
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-4">🎬</div>
                    <p className="text-gray-600 mb-2">No seats selected</p>
                    <p className="text-gray-500 text-sm">Click on available seats to select them</p>
                  </div>
                )}

                <div className="mt-4 sm:mt-6 p-3 bg-blue-50 rounded-lg">
                  <div className="text-blue-800 text-xs sm:text-sm">
                    <div className="font-medium mb-1">💡 Tip:</div>
                    <ul className="text-xs space-y-1">
                      <li>• Premium seats offer better view</li>
                      <li>• VIP seats include extra legroom</li>
                      <li>• Maximum 8 seats per booking</li>
                    </ul>
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

export default SeatSelectionPage;