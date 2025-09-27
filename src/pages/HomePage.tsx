import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieSearch from '../components/MovieSearch';

interface Movie {
  id: number;
  title: string;
  poster: string;
  rating: number;
  genre: string[];
  duration: string;
  description: string;
}

interface FeaturedMovie {
  id: number;
  title: string;
  poster: string;
  backdrop: string;
  description: string;
  rating: number;
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [featuredMovies, setFeaturedMovies] = useState<FeaturedMovie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [newReleases, setNewReleases] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Simulate API calls to fetch movies data
    const fetchMoviesData = async () => {
      try {
        // Mock featured movies
        const mockFeatured: FeaturedMovie[] = [
          {
            id: 1,
            title: 'Avatar: The Way of Water',
            poster: '/api/placeholder/300/450',
            backdrop: '/api/placeholder/1200/500',
            description: 'Jake Sully lives with his newfound family formed on the planet of Pandora.',
            rating: 8.7
          },
          {
            id: 2,
            title: 'Black Panther: Wakanda Forever',
            poster: '/api/placeholder/300/450',
            backdrop: '/api/placeholder/1200/500',
            description: 'The people of Wakanda fight to protect their home from intervening world powers.',
            rating: 8.2
          }
        ];

        // Mock trending movies
        const mockTrending: Movie[] = [
          {
            id: 3,
            title: 'Top Gun: Maverick',
            poster: '/api/placeholder/200/300',
            rating: 8.9,
            genre: ['Action', 'Drama'],
            duration: '2h 11m',
            description: 'After thirty years, Maverick is still pushing the envelope as a top naval aviator.'
          },
          {
            id: 4,
            title: 'Spider-Man: No Way Home',
            poster: '/api/placeholder/200/300',
            rating: 8.4,
            genre: ['Action', 'Adventure', 'Fantasy'],
            duration: '2h 28m',
            description: 'Spider-Man seeks help from Doctor Strange to forget his revealed identity.'
          },
          {
            id: 5,
            title: 'The Batman',
            poster: '/api/placeholder/200/300',
            rating: 8.1,
            genre: ['Action', 'Crime', 'Drama'],
            duration: '2h 56m',
            description: 'Batman ventures into Gotham City\'s underworld when a sadistic killer leaves behind a trail of cryptic clues.'
          }
        ];

        // Mock new releases
        const mockNewReleases: Movie[] = [
          {
            id: 6,
            title: 'Dune: Part Two',
            poster: '/api/placeholder/200/300',
            rating: 8.8,
            genre: ['Sci-Fi', 'Adventure'],
            duration: '2h 46m',
            description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators.'
          },
          {
            id: 7,
            title: 'Oppenheimer',
            poster: '/api/placeholder/200/300',
            rating: 8.6,
            genre: ['Biography', 'Drama', 'History'],
            duration: '3h 0m',
            description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.'
          }
        ];

        setTimeout(() => {
          setFeaturedMovies(mockFeatured);
          setTrendingMovies(mockTrending);
          setNewReleases(mockNewReleases);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching movies:', error);
        setLoading(false);
      }
    };

    fetchMoviesData();
  }, []);

  useEffect(() => {
    // Auto-rotate featured movies carousel
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  const MovieCard: React.FC<{ movie: Movie }> = ({ movie }) => (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer"
      onClick={() => navigate(`/movie/${movie.id}`)}
    >
      <div className="relative">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full h-64 object-cover rounded-t-lg"
        />
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-sm font-medium">
          ⭐ {movie.rating}
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">{movie.title}</h3>
        <div className="flex flex-wrap gap-1 mb-2">
          {movie.genre.map((g, index) => (
            <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {g}
            </span>
          ))}
        </div>
        <p className="text-gray-600 text-sm mb-2">{movie.duration}</p>
        <p className="text-gray-700 text-sm line-clamp-2">{movie.description}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Featured Movies */}
      <section className="relative h-96 overflow-hidden">
        {featuredMovies.length > 0 && (
          <div className="relative h-full">
            <img
              src={featuredMovies[currentSlide]?.backdrop}
              alt={featuredMovies[currentSlide]?.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center">
              <div className="container mx-auto px-6">
                <div className="max-w-2xl text-white">
                  <h1 className="text-5xl font-bold mb-4">
                    {featuredMovies[currentSlide]?.title}
                  </h1>
                  <p className="text-xl mb-6 opacity-90">
                    {featuredMovies[currentSlide]?.description}
                  </p>
                  <div className="flex items-center gap-4">
                    <button 
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
                      onClick={() => navigate(`/showtimes/${featuredMovies[currentSlide]?.id}`)}
                    >
                      Book Now
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-400">⭐</span>
                      <span className="font-semibold">{featuredMovies[currentSlide]?.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Carousel indicators */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {featuredMovies.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Search Section */}
      <section className="container mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Find Your Next Movie</h2>
          <p className="text-gray-600 text-lg">Search from thousands of movies and book your seats instantly</p>
        </div>
        <MovieSearch />
      </section>

      {/* Trending Movies */}
      <section className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
          <button className="text-blue-600 hover:text-blue-700 font-semibold">View All →</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {trendingMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* New Releases */}
      <section className="container mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">New Releases</h2>
          <button className="text-blue-600 hover:text-blue-700 font-semibold">View All →</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {newReleases.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
          <p className="text-blue-100 mb-6">Get notified about new releases and exclusive offers</p>
          <div className="flex justify-center">
            <div className="flex max-w-md w-full">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-l-lg text-gray-900 focus:outline-none"
              />
              <button className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-r-lg font-semibold transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;