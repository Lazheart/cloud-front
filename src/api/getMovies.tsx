import axios from "axios";

import { movieServiceClient } from './client';
import type { ApiResponse } from './client';

// Movie interfaces
export interface Movie {
  id: string;
  title: string;
  originalTitle?: string;
  description: string;
  synopsis?: string;
  duration: number; // in minutes
  releaseDate: string;
  rating: number; // IMDb rating
  genres: Genre[];
  director: string;
  cast: CastMember[];
  crew: CrewMember[];
  languages: string[];
  countries: string[];
  budget?: number;
  boxOffice?: number;
  certification: string; // PG, PG-13, R, etc.
  poster: string;
  backdrop: string;
  trailer?: string;
  images: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
}

export interface CastMember {
  id: string;
  name: string;
  character: string;
  profileImage?: string;
  order: number;
}

export interface CrewMember {
  id: string;
  name: string;
  job: string;
  department: string;
  profileImage?: string;
}

export interface MovieReview {
  id: string;
  movieId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title?: string;
  content: string;
  isVerifiedUser: boolean;
  likesCount: number;
  dislikesCount: number;
  isLiked?: boolean;
  isDisliked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MovieFilters {
  genres?: string[];
  year?: number;
  yearFrom?: number;
  yearTo?: number;
  rating?: number;
  ratingFrom?: number;
  ratingTo?: number;
  duration?: number;
  durationFrom?: number;
  durationTo?: number;
  language?: string;
  certification?: string;
  director?: string;
  cast?: string;
  isActive?: boolean;
  sortBy?: 'title' | 'releaseDate' | 'rating' | 'popularity' | 'duration';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface MovieStats {
  totalMovies: number;
  activeMovies: number;
  averageRating: number;
  totalGenres: number;
  recentMovies: number;
}

// Movie Service
export class MovieService {
  // Movie management
  async getMovies(filters?: MovieFilters): Promise<ApiResponse<PaginatedResponse<Movie>>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }
    return movieServiceClient.get<PaginatedResponse<Movie>>(`/?${params.toString()}`);
  }

  async getMovieById(movieId: string): Promise<ApiResponse<Movie>> {
    return movieServiceClient.get<Movie>(`/${movieId}`);
  }

  async searchMovies(query: string, filters?: Omit<MovieFilters, 'page' | 'limit'>): Promise<ApiResponse<PaginatedResponse<Movie>>> {
    const params = new URLSearchParams({ q: query });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }
    return movieServiceClient.get<PaginatedResponse<Movie>>(`/search?${params.toString()}`);
  }

  // Featured and popular movies
  async getFeaturedMovies(): Promise<ApiResponse<Movie[]>> {
    return movieServiceClient.get<Movie[]>('/featured');
  }

  async getPopularMovies(limit: number = 10): Promise<ApiResponse<Movie[]>> {
    return movieServiceClient.get<Movie[]>(`/popular?limit=${limit}`);
  }

  async getTrendingMovies(period: 'day' | 'week' | 'month' = 'week'): Promise<ApiResponse<Movie[]>> {
    return movieServiceClient.get<Movie[]>(`/trending?period=${period}`);
  }

  async getNewReleases(limit: number = 10): Promise<ApiResponse<Movie[]>> {
    return movieServiceClient.get<Movie[]>(`/new-releases?limit=${limit}`);
  }

  async getUpcomingMovies(limit: number = 10): Promise<ApiResponse<Movie[]>> {
    return movieServiceClient.get<Movie[]>(`/upcoming?limit=${limit}`);
  }

  async getNowPlaying(limit: number = 10): Promise<ApiResponse<Movie[]>> {
    return movieServiceClient.get<Movie[]>(`/now-playing?limit=${limit}`);
  }

  // Movie recommendations
  async getRecommendations(movieId: string, limit: number = 5): Promise<ApiResponse<Movie[]>> {
    return movieServiceClient.get<Movie[]>(`/${movieId}/recommendations?limit=${limit}`);
  }

  async getSimilarMovies(movieId: string, limit: number = 5): Promise<ApiResponse<Movie[]>> {
    return movieServiceClient.get<Movie[]>(`/${movieId}/similar?limit=${limit}`);
  }

  async getPersonalizedRecommendations(limit: number = 10): Promise<ApiResponse<Movie[]>> {
    return movieServiceClient.get<Movie[]>(`/recommendations/personal?limit=${limit}`);
  }

  // Genres and categories
  async getGenres(): Promise<ApiResponse<Genre[]>> {
    return movieServiceClient.get<Genre[]>('/genres');
  }

  async getMoviesByGenre(genreId: string, filters?: Omit<MovieFilters, 'genres'>): Promise<ApiResponse<PaginatedResponse<Movie>>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }
    return movieServiceClient.get<PaginatedResponse<Movie>>(`/genres/${genreId}/movies?${params.toString()}`);
  }

  // Movie reviews and ratings
  async getMovieReviews(movieId: string, page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<MovieReview>>> {
    return movieServiceClient.get<PaginatedResponse<MovieReview>>(`/${movieId}/reviews?page=${page}&limit=${limit}`);
  }

  async addMovieReview(movieId: string, review: { rating: number; title?: string; content: string }): Promise<ApiResponse<MovieReview>> {
    return movieServiceClient.post<MovieReview>(`/${movieId}/reviews`, review);
  }

  async updateMovieReview(movieId: string, reviewId: string, review: { rating?: number; title?: string; content?: string }): Promise<ApiResponse<MovieReview>> {
    return movieServiceClient.patch<MovieReview>(`/${movieId}/reviews/${reviewId}`, review);
  }

  async deleteMovieReview(movieId: string, reviewId: string): Promise<ApiResponse<void>> {
    return movieServiceClient.delete<void>(`/${movieId}/reviews/${reviewId}`);
  }

  async likeReview(movieId: string, reviewId: string): Promise<ApiResponse<void>> {
    return movieServiceClient.post<void>(`/${movieId}/reviews/${reviewId}/like`);
  }

  async dislikeReview(movieId: string, reviewId: string): Promise<ApiResponse<void>> {
    return movieServiceClient.post<void>(`/${movieId}/reviews/${reviewId}/dislike`);
  }

  // Movie statistics
  async getMovieStats(): Promise<ApiResponse<MovieStats>> {
    return movieServiceClient.get<MovieStats>('/stats');
  }

  async getMovieRating(movieId: string): Promise<ApiResponse<{
    averageRating: number;
    totalRatings: number;
    ratingDistribution: { rating: number; count: number }[];
  }>> {
    return movieServiceClient.get(`/${movieId}/rating`);
  }

  // Advanced search and filters
  async getMoviesByDirector(director: string, filters?: Omit<MovieFilters, 'director'>): Promise<ApiResponse<PaginatedResponse<Movie>>> {
    const params = new URLSearchParams({ director });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }
    return movieServiceClient.get<PaginatedResponse<Movie>>(`/search/director?${params.toString()}`);
  }

  async getMoviesByCast(castMember: string, filters?: Omit<MovieFilters, 'cast'>): Promise<ApiResponse<PaginatedResponse<Movie>>> {
    const params = new URLSearchParams({ cast: castMember });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }
    return movieServiceClient.get<PaginatedResponse<Movie>>(`/search/cast?${params.toString()}`);
  }

  async getMoviesByYear(year: number, filters?: Omit<MovieFilters, 'year'>): Promise<ApiResponse<PaginatedResponse<Movie>>> {
    const params = new URLSearchParams({ year: year.toString() });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }
    return movieServiceClient.get<PaginatedResponse<Movie>>(`/search/year?${params.toString()}`);
  }
}

// Export singleton instance
export const movieService = new MovieService();
export default movieService;

export const getMovies = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching movies:", error);
    throw error;
  }
};
