import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface Movie {
  id: number;
  title: string;
  poster: string;
  backdrop: string;
  rating: number;
  genre: string[];
  duration: string;
  description: string;
  director: string;
  cast: string[];
  releaseDate: string;
  language: string;
  reviews: Review[];
  showtimes: Showtime[];
}

interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

interface Showtime {
  id: number;
  time: string;
  date: string;
  theater: string;
  availableSeats: number;
  price: number;
}

interface MoviePageProps {
  // movieId will be obtained from URL params
}

const MoviePage: React.FC<MoviePageProps> = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch movie details
    const fetchMovie = async () => {
      try {
        // Mock movie data
        const mockMovie: Movie = {
          id: parseInt(movieId || '1'),
          title: 'Avatar: The Way of Water',
          poster: '/api/placeholder/400/600',
          backdrop: '/api/placeholder/1200/600',
          rating: 8.7,
          genre: ['Action', 'Adventure', 'Fantasy', 'Sci-Fi'],
          duration: '3h 12m',
          description: 'Set more than a decade after the events of the first film, Avatar: The Way of Water begins to tell the story of the Sully family (Jake, Neytiri, and their kids), the trouble that follows them, the lengths they go to keep each other safe, the battles they fight to stay alive, and the tragedies they endure.',
          director: 'James Cameron',
          cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver', 'Stephen Lang', 'Kate Winslet'],
          releaseDate: '2022-12-16',
          language: 'English',
          reviews: [
            {
              id: 1,
              author: 'MovieLover123',
              rating: 9,
              comment: 'Visually stunning masterpiece. The underwater scenes are breathtaking!',
              date: '2024-01-15'
            },
            {
              id: 2,
              author: 'CinematicReview',
              rating: 8,
              comment: 'Great sequel that expands the world beautifully. A bit long but worth it.',
              date: '2024-01-10'
            }
          ],
          showtimes: [
            {
              id: 1,
              time: '14:30',
              date: '2024-01-28',
              theater: 'Cinema Central Hall 1',
              availableSeats: 45,
              price: 12.50
            },
            {
              id: 2,
              time: '17:45',
              date: '2024-01-28',
              theater: 'Cinema Central Hall 2',
              availableSeats: 32,
              price: 15.00
            },
            {
              id: 3,
              time: '21:00',
              date: '2024-01-28',
              theater: 'Cinema Central Hall 1',
              availableSeats: 28,
              price: 15.00
            }
          ]
        };

        setTimeout(() => {
          setMovie(mockMovie);
          setSelectedDate('2024-01-28');
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching movie:', error);
        setLoading(false);
      }
    };

    fetchMovie();
  }, [movieId]);

  const handleBookNow = (showtime: Showtime) => {
    // Navigate to seat selection page
    navigate(`/seats/${showtime.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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

  const filteredShowtimes = movie.showtimes.filter(showtime => 
    selectedDate === '' || showtime.date === selectedDate
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <img
          src={movie.backdrop}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-6 pb-8">
            <div className="flex items-end gap-6">
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-48 h-72 object-cover rounded-lg shadow-lg"
              />
              <div className="text-white flex-1">
                <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">⭐</span>
                    <span className="text-xl font-semibold">{movie.rating}</span>
                    <span className="text-gray-300">/10</span>
                  </div>
                  <span className="text-gray-300">•</span>
                  <span>{movie.duration}</span>
                  <span className="text-gray-300">•</span>
                  <span>{new Date(movie.releaseDate).getFullYear()}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {movie.genre.map((g, index) => (
                    <span key={index} className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                      {g}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setShowTrailer(true)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  ▶ Watch Trailer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Synopsis */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Synopsis</h2>
              <p className="text-gray-700 leading-relaxed">{movie.description}</p>
            </section>

            {/* Cast & Crew */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cast & Crew</h2>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <div className="mb-4">
                  <span className="font-semibold text-gray-900">Director:</span>
                  <span className="text-gray-700 ml-2">{movie.director}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">Starring:</span>
                  <span className="text-gray-700 ml-2">{movie.cast.join(', ')}</span>
                </div>
              </div>
            </section>

            {/* Reviews */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Reviews</h2>
              <div className="space-y-4">
                {movie.reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-lg p-6 shadow-md">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-semibold text-gray-900">{review.author}</div>
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">⭐</span>
                        <span className="font-medium">{review.rating}/10</span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{review.comment}</p>
                    <div className="text-gray-500 text-sm">
                      {new Date(review.date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Movie Info */}
            <div className="bg-white rounded-lg p-6 shadow-md mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Movie Info</h3>
              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-700">Release Date:</span>
                  <div className="text-gray-900">{new Date(movie.releaseDate).toLocaleDateString()}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Duration:</span>
                  <div className="text-gray-900">{movie.duration}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Language:</span>
                  <div className="text-gray-900">{movie.language}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Genres:</span>
                  <div className="text-gray-900">{movie.genre.join(', ')}</div>
                </div>
              </div>
            </div>

            {/* Showtimes */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Showtimes</h3>
              
              {/* Date Selector */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Date:</label>
                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="2024-01-28">Today - Jan 28</option>
                  <option value="2024-01-29">Tomorrow - Jan 29</option>
                  <option value="2024-01-30">Jan 30</option>
                </select>
              </div>

              {/* Showtime List */}
              <div className="space-y-3">
                {filteredShowtimes.map((showtime) => (
                  <div key={showtime.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-bold text-lg text-gray-900">{showtime.time}</div>
                        <div className="text-sm text-gray-600">{showtime.theater}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">${showtime.price}</div>
                        <div className="text-sm text-gray-600">{showtime.availableSeats} seats left</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleBookNow(showtime)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors"
                      disabled={showtime.availableSeats === 0}
                    >
                      {showtime.availableSeats === 0 ? 'Sold Out' : 'Book Now'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      {showTrailer && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{movie.title} - Trailer</h3>
              <button
                onClick={() => setShowTrailer(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-gray-500">Trailer would be embedded here</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoviePage;