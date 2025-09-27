import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Movie {
  id: number;
  title: string;
  poster: string;
  rating: number;
  duration: string;
  genre: string[];
  description: string;
}

interface Theater {
  id: number;
  name: string;
  location: string;
  distance: string;
  facilities: string[];
}

interface Showtime {
  id: number;
  time: string;
  date: string;
  theaterId: number;
  availableSeats: number;
  totalSeats: number;
  price: number;
  format: '2D' | '3D' | 'IMAX' | '4DX';
}

const ShowSelectionPage: React.FC = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTheater, setSelectedTheater] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const dates = [
    { date: '2024-01-26', display: 'Today' },
    { date: '2024-01-27', display: 'Tomorrow' },
    { date: '2024-01-28', display: 'Sun, Jan 28' },
    { date: '2024-01-29', display: 'Mon, Jan 29' },
    { date: '2024-01-30', display: 'Tue, Jan 30' },
    { date: '2024-01-31', display: 'Wed, Jan 31' },
    { date: '2024-02-01', display: 'Thu, Feb 1' }
  ];

  useEffect(() => {
    // Simulate API calls to fetch movie details, theaters, and showtimes
    const fetchData = async () => {
      try {
        const mockMovie: Movie = {
          id: parseInt(movieId || '1'),
          title: 'Avatar: The Way of Water',
          poster: '/api/placeholder/300/450',
          rating: 8.7,
          duration: '3h 12m',
          genre: ['Action', 'Adventure', 'Fantasy', 'Sci-Fi'],
          description: 'Set more than a decade after the events of the first film, Avatar: The Way of Water begins to tell the story of the Sully family.'
        };

        const mockTheaters: Theater[] = [
          {
            id: 1,
            name: 'Cinema Central',
            location: 'Downtown Mall, 2nd Floor',
            distance: '2.1 km',
            facilities: ['IMAX', 'Dolby Atmos', 'Recliner Seats', 'Parking']
          },
          {
            id: 2,
            name: 'MoviePlex Grand',
            location: 'Grand Plaza, Level 3',
            distance: '3.5 km',
            facilities: ['4DX', 'Premium Lounge', 'Food Court', 'Valet Parking']
          },
          {
            id: 3,
            name: 'Star Cinema',
            location: 'City Center, Ground Floor',
            distance: '1.8 km',
            facilities: ['3D', 'Snack Bar', 'Wheelchair Access', 'Metro Access']
          },
          {
            id: 4,
            name: 'Royal Theater',
            location: 'Royal Mall, 4th Floor',
            distance: '4.2 km',
            facilities: ['VIP Lounge', 'Premium Sound', 'Reserved Parking', 'Concierge']
          }
        ];

        const mockShowtimes: Showtime[] = [
          // Cinema Central
          { id: 1, time: '10:30', date: '2024-01-26', theaterId: 1, availableSeats: 89, totalSeats: 120, price: 12.50, format: '2D' },
          { id: 2, time: '14:15', date: '2024-01-26', theaterId: 1, availableSeats: 67, totalSeats: 150, price: 18.00, format: 'IMAX' },
          { id: 3, time: '17:45', date: '2024-01-26', theaterId: 1, availableSeats: 23, totalSeats: 120, price: 15.00, format: '3D' },
          { id: 4, time: '21:30', date: '2024-01-26', theaterId: 1, availableSeats: 45, totalSeats: 150, price: 18.00, format: 'IMAX' },

          // MoviePlex Grand
          { id: 5, time: '11:00', date: '2024-01-26', theaterId: 2, availableSeats: 78, totalSeats: 100, price: 22.00, format: '4DX' },
          { id: 6, time: '15:30', date: '2024-01-26', theaterId: 2, availableSeats: 12, totalSeats: 80, price: 16.00, format: '3D' },
          { id: 7, time: '19:15', date: '2024-01-26', theaterId: 2, availableSeats: 34, totalSeats: 100, price: 22.00, format: '4DX' },
          { id: 8, time: '22:45', date: '2024-01-26', theaterId: 2, availableSeats: 56, totalSeats: 80, price: 13.50, format: '2D' },

          // Star Cinema
          { id: 9, time: '12:45', date: '2024-01-26', theaterId: 3, availableSeats: 95, totalSeats: 110, price: 11.00, format: '2D' },
          { id: 10, time: '16:30', date: '2024-01-26', theaterId: 3, availableSeats: 43, totalSeats: 110, price: 14.00, format: '3D' },
          { id: 11, time: '20:00', date: '2024-01-26', theaterId: 3, availableSeats: 67, totalSeats: 110, price: 14.00, format: '3D' },

          // Royal Theater
          { id: 12, time: '13:30', date: '2024-01-26', theaterId: 4, availableSeats: 28, totalSeats: 60, price: 20.00, format: '3D' },
          { id: 13, time: '18:00', date: '2024-01-26', theaterId: 4, availableSeats: 15, totalSeats: 60, price: 20.00, format: '3D' },
          { id: 14, time: '21:15', date: '2024-01-26', theaterId: 4, availableSeats: 8, totalSeats: 60, price: 20.00, format: '3D' }
        ];

        setTimeout(() => {
          setMovie(mockMovie);
          setTheaters(mockTheaters);
          setShowtimes(mockShowtimes);
          setSelectedDate('2024-01-26');
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [movieId]);

  const filteredShowtimes = showtimes.filter(showtime => {
    const dateMatch = selectedDate === '' || showtime.date === selectedDate;
    const theaterMatch = selectedTheater === null || showtime.theaterId === selectedTheater;
    return dateMatch && theaterMatch;
  });

  const getFormatColor = (format: string) => {
    switch (format) {
      case 'IMAX':
        return 'bg-red-100 text-red-800';
      case '4DX':
        return 'bg-purple-100 text-purple-800';
      case '3D':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityColor = (available: number, total: number) => {
    const percentage = (available / total) * 100;
    if (percentage > 60) return 'text-green-600';
    if (percentage > 20) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleShowtimeSelect = (showtime: Showtime) => {
    // Navigate to seat selection page
    navigate(`/seats/${showtime.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading showtimes...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Movie Not Found</h2>
          <p className="text-gray-600">The requested movie could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Movie Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex gap-6">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-32 h-48 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{movie.title}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">⭐</span>
                    <span className="text-lg font-semibold">{movie.rating}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-600">{movie.duration}</span>
                  <span className="text-gray-400">•</span>
                  <div className="flex gap-1">
                    {movie.genre.slice(0, 3).map((g, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed">{movie.description}</p>
              </div>
            </div>
          </div>

          {/* Date Selection */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Select Date</h2>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {dates.map((dateOption) => (
                <button
                  key={dateOption.date}
                  onClick={() => setSelectedDate(dateOption.date)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                    selectedDate === dateOption.date
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {dateOption.display}
                </button>
              ))}
            </div>
          </div>

          {/* Theater Filter */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Filter by Theater</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedTheater(null)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedTheater === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                }`}
              >
                All Theaters
              </button>
              {theaters.map((theater) => (
                <button
                  key={theater.id}
                  onClick={() => setSelectedTheater(theater.id)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    selectedTheater === theater.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {theater.name}
                </button>
              ))}
            </div>
          </div>

          {/* Showtimes by Theater */}
          <div className="space-y-6">
            {theaters
              .filter(theater => selectedTheater === null || theater.id === selectedTheater)
              .map((theater) => {
                const theaterShowtimes = filteredShowtimes.filter(s => s.theaterId === theater.id);
                
                if (theaterShowtimes.length === 0) return null;

                return (
                  <div key={theater.id} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{theater.name}</h3>
                        <p className="text-gray-600 mb-2">{theater.location} • {theater.distance} away</p>
                        <div className="flex flex-wrap gap-2">
                          {theater.facilities.map((facility, index) => (
                            <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              {facility}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        View on Map →
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {theaterShowtimes.map((showtime) => (
                        <div
                          key={showtime.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => handleShowtimeSelect(showtime)}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="text-lg font-bold text-gray-900">
                              {showtime.time}
                            </div>
                            <span className={`text-xs px-2 py-1 rounded ${getFormatColor(showtime.format)}`}>
                              {showtime.format}
                            </span>
                          </div>
                          
                          <div className="text-sm text-gray-600 mb-2">
                            <span className={getAvailabilityColor(showtime.availableSeats, showtime.totalSeats)}>
                              {showtime.availableSeats} of {showtime.totalSeats} seats available
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-gray-900">
                              ${showtime.price.toFixed(2)}
                            </span>
                            <button 
                              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-3 py-1 rounded transition-colors"
                              disabled={showtime.availableSeats === 0}
                            >
                              {showtime.availableSeats === 0 ? 'Sold Out' : 'Book Now'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>

          {filteredShowtimes.length === 0 && (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-gray-400 text-4xl mb-4">🎬</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No showtimes available</h3>
              <p className="text-gray-600">
                {selectedTheater
                  ? 'No showtimes available for the selected theater and date.'
                  : 'No showtimes available for the selected date.'}
              </p>
              <button
                onClick={() => {
                  setSelectedDate(dates[0].date);
                  setSelectedTheater(null);
                }}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShowSelectionPage;