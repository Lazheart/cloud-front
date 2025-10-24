import axios from 'axios';
import config from '../config/env';
import { mockMovies } from './mockData';

// Types for Movies API
export interface ShowTime {
  id: number;
  startTime: string;
  precio: number;
  cinemaIdExt: string;
  salaIdExt: string;
  salaNumber: number;
}

export interface Movie {
  id: number;
  name: string;
  genre: string;
  description: string;
  time: number;
  ageRestriction: string;
  premiere: boolean;
  poster?: string;
  backdrop?: string;
  showTimes: ShowTime[];
}

export interface CreateMovieRequest {
  id: number;
  name: string;
  genre: string;
  description: string;
  time: number;
  ageRestriction: string;
  premiere: boolean;
  showTimes: ShowTime[];
}

export interface UpdateMovieRequest {
  id: number;
  name: string;
  genre: string;
  description: string;
  time: number;
  ageRestriction: string;
  premiere: boolean;
  showTimes: ShowTime[];
}

export interface UpdatePremiereRequest {
  premiere: boolean;
}

export interface CreateShowTimeRequest {
  id: number;
  startTime: string;
  precio: number;
  cinemaIdExt: string;
  salaIdExt: string;
  salaNumber: number;
}

export interface ApiResponse {
  message: string;
}

export interface ServiceError {
  message: string;
  status: number;
  details?: any;
}

// Service response type
export interface ServiceResponse<T> {
  data: T | null;
  error: ServiceError | null;
}

/**
 * Movies Service
 * Handles movies operations through REST API
 */
export class MoviesService {
  private baseURL: string;

  constructor() {
    this.baseURL = config.api.movieService;
  }

  /**
   * Get all movies
   * @returns ServiceResponse with array of movies
   */
  async getMoviesService(): Promise<ServiceResponse<Movie[]>> {
    try {
      const response = await axios.get(`${this.baseURL}/movies`, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000, // 5 second timeout
      });

      return {
        data: response.data,
        error: null,
      };
    } catch (error: any) {
      // If network error or timeout, return mock data for development
      if (error.code === 'ERR_NAME_NOT_RESOLVED' || 
          error.code === 'ERR_NETWORK' || 
          error.code === 'ECONNABORTED' ||
          error.message?.includes('timeout')) {
        console.warn('Movies service unavailable, using mock data');
        return {
          data: mockMovies,
          error: null,
        };
      }

      const serviceError: ServiceError = {
        message: error.response?.data?.message || error.message || 'Failed to fetch movies',
        status: error.response?.status || 500,
        details: error.response?.data,
      };

      return {
        data: null,
        error: serviceError,
      };
    }
  }

  /**
   * Get a movie by ID
   * @param id - Movie ID
   * @returns ServiceResponse with movie data
   */
  async getMovieByIdService(id: number): Promise<ServiceResponse<Movie>> {
    try {
      const response = await axios.get(`${this.baseURL}/movies/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return {
        data: response.data,
        error: null,
      };
    } catch (error: any) {
      const serviceError: ServiceError = {
        message: error.response?.data?.message || error.message || 'Failed to fetch movie',
        status: error.response?.status || 500,
        details: error.response?.data,
      };

      return {
        data: null,
        error: serviceError,
      };
    }
  }

  /**
   * Create a new movie
   * @param movieData - Movie data to create
   * @returns ServiceResponse with creation result
   */
  async createMovieService(movieData: CreateMovieRequest): Promise<ServiceResponse<ApiResponse>> {
    try {
      const response = await axios.post(`${this.baseURL}/movies`, movieData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return {
        data: response.data,
        error: null,
      };
    } catch (error: any) {
      const serviceError: ServiceError = {
        message: error.response?.data?.message || error.message || 'Failed to create movie',
        status: error.response?.status || 500,
        details: error.response?.data,
      };

      return {
        data: null,
        error: serviceError,
      };
    }
  }

  /**
   * Update a movie completely
   * @param id - Movie ID
   * @param movieData - Complete movie data
   * @returns ServiceResponse with update result
   */
  async updateMovieService(id: number, movieData: UpdateMovieRequest): Promise<ServiceResponse<ApiResponse>> {
    try {
      const response = await axios.put(`${this.baseURL}/movies/${id}`, movieData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return {
        data: response.data,
        error: null,
      };
    } catch (error: any) {
      const serviceError: ServiceError = {
        message: error.response?.data?.message || error.message || 'Failed to update movie',
        status: error.response?.status || 500,
        details: error.response?.data,
      };

      return {
        data: null,
        error: serviceError,
      };
    }
  }

  /**
   * Update movie premiere status
   * @param id - Movie ID
   * @param premiereData - Premiere status data
   * @returns ServiceResponse with update result
   */
  async updateMoviePremiereService(id: number, premiereData: UpdatePremiereRequest): Promise<ServiceResponse<ApiResponse>> {
    try {
      const response = await axios.patch(`${this.baseURL}/movies/${id}/premiere`, premiereData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return {
        data: response.data,
        error: null,
      };
    } catch (error: any) {
      const serviceError: ServiceError = {
        message: error.response?.data?.message || error.message || 'Failed to update movie premiere',
        status: error.response?.status || 500,
        details: error.response?.data,
      };

      return {
        data: null,
        error: serviceError,
      };
    }
  }

  /**
   * Delete a movie
   * @param id - Movie ID
   * @returns ServiceResponse with deletion result
   */
  async deleteMovieService(id: number): Promise<ServiceResponse<ApiResponse>> {
    try {
      const response = await axios.delete(`${this.baseURL}/movies/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return {
        data: response.data,
        error: null,
      };
    } catch (error: any) {
      const serviceError: ServiceError = {
        message: error.response?.data?.message || error.message || 'Failed to delete movie',
        status: error.response?.status || 500,
        details: error.response?.data,
      };

      return {
        data: null,
        error: serviceError,
      };
    }
  }

  /**
   * Get showtimes for a specific movie
   * @param movieId - Movie ID
   * @returns ServiceResponse with array of showtimes
   */
  async getMovieShowtimesService(movieId: number): Promise<ServiceResponse<ShowTime[]>> {
    try {
      const response = await axios.get(`${this.baseURL}/movies/${movieId}/showtimes`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return {
        data: response.data,
        error: null,
      };
    } catch (error: any) {
      const serviceError: ServiceError = {
        message: error.response?.data?.message || error.message || 'Failed to fetch movie showtimes',
        status: error.response?.status || 500,
        details: error.response?.data,
      };

      return {
        data: null,
        error: serviceError,
      };
    }
  }

  /**
   * Add a new showtime to a movie
   * @param movieId - Movie ID
   * @param showtimeData - Showtime data to add
   * @returns ServiceResponse with addition result
   */
  async addMovieShowtimeService(movieId: number, showtimeData: CreateShowTimeRequest): Promise<ServiceResponse<ApiResponse>> {
    try {
      const response = await axios.post(`${this.baseURL}/movies/${movieId}/showtimes`, showtimeData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return {
        data: response.data,
        error: null,
      };
    } catch (error: any) {
      const serviceError: ServiceError = {
        message: error.response?.data?.message || error.message || 'Failed to add movie showtime',
        status: error.response?.status || 500,
        details: error.response?.data,
      };

      return {
        data: null,
        error: serviceError,
      };
    }
  }
}

// Export singleton instance
export const moviesService = new MoviesService();

// Export individual functions for convenience
export const getMoviesService = () => moviesService.getMoviesService();
export const getMovieByIdService = (id: number) => moviesService.getMovieByIdService(id);
export const createMovieService = (data: CreateMovieRequest) => moviesService.createMovieService(data);
export const updateMovieService = (id: number, data: UpdateMovieRequest) => moviesService.updateMovieService(id, data);
export const updateMoviePremiereService = (id: number, data: UpdatePremiereRequest) => moviesService.updateMoviePremiereService(id, data);
export const deleteMovieService = (id: number) => moviesService.deleteMovieService(id);
export const getMovieShowtimesService = (movieId: number) => moviesService.getMovieShowtimesService(movieId);
export const addMovieShowtimeService = (movieId: number, data: CreateShowTimeRequest) => moviesService.addMovieShowtimeService(movieId, data);
