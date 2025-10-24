import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieSearch from '../components/MovieSearch';
import MovieImage from '../components/MovieImage';
import { useMovies } from '../hooks/useMovies';
import type { Movie } from '../services/moviesService';

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
  const { data: movies, loading, error, handleGetMovies } = useMovies();
  const [featuredMovies, setFeaturedMovies] = useState<FeaturedMovie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [newReleases, setNewReleases] = useState<Movie[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    // Load movies from API
    handleGetMovies();
  }, []);

  useEffect(() => {
    if (movies && movies.length > 0) {
      // Set featured movies (first 2 movies)
      const featured = movies.slice(0, 2).map(movie => ({
        id: movie.id,
        title: movie.name,
        poster: movie.poster || '/api/placeholder/300/450',
        backdrop: movie.backdrop || '/api/placeholder/1200/500',
        description: movie.description,
        rating: 8.5 // Default rating since not in API
      }));

      // Set trending movies (next 3 movies)
      const trending = movies.slice(2, 5);

      // Set new releases (remaining movies)
      const newReleases = movies.slice(5, 7);

      setFeaturedMovies(featured);
      setTrendingMovies(trending);
      setNewReleases(newReleases);
    }
  }, [movies]);

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
        <MovieImage
          src={movie.poster || "/api/placeholder/200/300"}
          alt={movie.name}
          className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-t-lg"
        />
        <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md text-xs sm:text-sm font-medium">
          ⭐ 8.5
        </div>
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 line-clamp-1">{movie.name}</h3>
        <div className="flex flex-wrap gap-1 mb-2">
          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {movie.genre}
          </span>
        </div>
        <p className="text-gray-600 text-xs sm:text-sm mb-2">{movie.time} min</p>
        <p className="text-gray-700 text-xs sm:text-sm line-clamp-2">{movie.description}</p>
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
      <section className="relative h-64 sm:h-80 md:h-96 lg:h-[500px] overflow-hidden">
        {featuredMovies.length > 0 && (
          <div className="relative h-full">
            <img
              src={featuredMovies[currentSlide]?.backdrop}
              alt={featuredMovies[currentSlide]?.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center">
              <div className="container mx-auto px-4 sm:px-6">
                <div className="max-w-2xl text-white">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4">
                    {featuredMovies[currentSlide]?.title}
                  </h1>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 opacity-90 line-clamp-2 sm:line-clamp-3">
                    {featuredMovies[currentSlide]?.description}
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    <button 
                      className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 sm:py-3 px-6 sm:px-8 rounded-lg transition-colors text-sm sm:text-base"
                      onClick={() => navigate(`/showtimes/${featuredMovies[currentSlide]?.id}`)}
                    >
                      Book Now
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-400">⭐</span>
                      <span className="font-semibold text-sm sm:text-base">{featuredMovies[currentSlide]?.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Carousel indicators */}
            <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1 sm:gap-2">
              {featuredMovies.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Search Section */}
      <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">Find Your Next Movie</h2>
          <p className="text-gray-600 text-base sm:text-lg px-4">Search from thousands of movies and book your seats instantly</p>
        </div>
        <MovieSearch />
      </section>

      {/* Trending Movies */}
      <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Trending Now</h2>
          <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm sm:text-base">View All →</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {trendingMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* New Releases */}
      <section className="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-2">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">New Releases</h2>
          <button className="text-blue-600 hover:text-blue-700 font-semibold text-sm sm:text-base">View All →</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {newReleases.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-blue-600 text-white py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Stay Updated</h2>
          <p className="text-blue-100 mb-4 sm:mb-6 text-sm sm:text-base">Get notified about new releases and exclusive offers</p>
          <div className="flex justify-center">
            <div className="flex flex-col sm:flex-row max-w-md w-full gap-2 sm:gap-0">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg sm:rounded-l-lg sm:rounded-r-none text-gray-900 focus:outline-none text-sm sm:text-base"
              />
              <button className="bg-red-600 hover:bg-red-700 px-4 sm:px-6 py-3 rounded-lg sm:rounded-r-lg sm:rounded-l-none font-semibold transition-colors text-sm sm:text-base">
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