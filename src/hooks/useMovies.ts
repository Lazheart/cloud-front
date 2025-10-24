import { useState, useEffect } from 'react';
import { 
  moviesService, 
  Movie, 
  ShowTime, 
  CreateMovieRequest, 
  UpdateMovieRequest, 
  UpdatePremiereRequest, 
  CreateShowTimeRequest, 
  ApiResponse, 
  ServiceError 
} from '../services/moviesService';

// Hook state interface
export interface UseMoviesState {
  data: any;
  loading: boolean;
  error: ServiceError | null;
}

// Hook return interface
export interface UseMoviesReturn extends UseMoviesState {
  handleGetMovies: () => Promise<void>;
  handleGetMovieById: (id: number) => Promise<void>;
  handleCreateMovie: (data: CreateMovieRequest) => Promise<void>;
  handleUpdateMovie: (id: number, data: UpdateMovieRequest) => Promise<void>;
  handleUpdateMoviePremiere: (id: number, data: UpdatePremiereRequest) => Promise<void>;
  handleDeleteMovie: (id: number) => Promise<void>;
  handleGetMovieShowtimes: (movieId: number) => Promise<void>;
  handleAddMovieShowtime: (movieId: number, data: CreateShowTimeRequest) => Promise<void>;
  clearError: () => void;
  refreshData: () => Promise<void>;
}

/**
 * Movies Management Hook
 * Manages movies operations and state
 */
export const useMovies = (): UseMoviesReturn => {
  const [state, setState] = useState<UseMoviesState>({
    data: null,
    loading: false,
    error: null,
  });

  /**
   * Get all movies
   */
  const handleGetMovies = async (): Promise<void> => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await moviesService.getMoviesService();
      
      if (response.error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error,
        }));
        return;
      }

      setState(prev => ({
        ...prev,
        data: response.data,
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: {
          message: 'Unexpected error fetching movies',
          status: 500,
          details: error,
        },
      }));
    }
  };

  /**
   * Get a movie by ID
   * @param id - Movie ID
   */
  const handleGetMovieById = async (id: number): Promise<void> => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await moviesService.getMovieByIdService(id);
      
      if (response.error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error,
        }));
        return;
      }

      setState(prev => ({
        ...prev,
        data: response.data,
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: {
          message: 'Unexpected error fetching movie',
          status: 500,
          details: error,
        },
      }));
    }
  };

  /**
   * Create a new movie
   * @param data - Movie data to create
   */
  const handleCreateMovie = async (data: CreateMovieRequest): Promise<void> => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await moviesService.createMovieService(data);
      
      if (response.error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error,
        }));
        return;
      }

      setState(prev => ({
        ...prev,
        data: response.data,
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: {
          message: 'Unexpected error creating movie',
          status: 500,
          details: error,
        },
      }));
    }
  };

  /**
   * Update a movie completely
   * @param id - Movie ID
   * @param data - Complete movie data
   */
  const handleUpdateMovie = async (id: number, data: UpdateMovieRequest): Promise<void> => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await moviesService.updateMovieService(id, data);
      
      if (response.error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error,
        }));
        return;
      }

      setState(prev => ({
        ...prev,
        data: response.data,
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: {
          message: 'Unexpected error updating movie',
          status: 500,
          details: error,
        },
      }));
    }
  };

  /**
   * Update movie premiere status
   * @param id - Movie ID
   * @param data - Premiere status data
   */
  const handleUpdateMoviePremiere = async (id: number, data: UpdatePremiereRequest): Promise<void> => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await moviesService.updateMoviePremiereService(id, data);
      
      if (response.error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error,
        }));
        return;
      }

      setState(prev => ({
        ...prev,
        data: response.data,
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: {
          message: 'Unexpected error updating movie premiere',
          status: 500,
          details: error,
        },
      }));
    }
  };

  /**
   * Delete a movie
   * @param id - Movie ID
   */
  const handleDeleteMovie = async (id: number): Promise<void> => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await moviesService.deleteMovieService(id);
      
      if (response.error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error,
        }));
        return;
      }

      setState(prev => ({
        ...prev,
        data: response.data,
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: {
          message: 'Unexpected error deleting movie',
          status: 500,
          details: error,
        },
      }));
    }
  };

  /**
   * Get showtimes for a specific movie
   * @param movieId - Movie ID
   */
  const handleGetMovieShowtimes = async (movieId: number): Promise<void> => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await moviesService.getMovieShowtimesService(movieId);
      
      if (response.error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error,
        }));
        return;
      }

      setState(prev => ({
        ...prev,
        data: response.data,
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: {
          message: 'Unexpected error fetching movie showtimes',
          status: 500,
          details: error,
        },
      }));
    }
  };

  /**
   * Add a new showtime to a movie
   * @param movieId - Movie ID
   * @param data - Showtime data to add
   */
  const handleAddMovieShowtime = async (movieId: number, data: CreateShowTimeRequest): Promise<void> => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await moviesService.addMovieShowtimeService(movieId, data);
      
      if (response.error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error,
        }));
        return;
      }

      setState(prev => ({
        ...prev,
        data: response.data,
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: {
          message: 'Unexpected error adding movie showtime',
          status: 500,
          details: error,
        },
      }));
    }
  };

  /**
   * Clear error state
   */
  const clearError = (): void => {
    setState(prev => ({
      ...prev,
      error: null,
    }));
  };

  /**
   * Refresh data by getting all movies
   */
  const refreshData = async (): Promise<void> => {
    await handleGetMovies();
  };

  return {
    ...state,
    handleGetMovies,
    handleGetMovieById,
    handleCreateMovie,
    handleUpdateMovie,
    handleUpdateMoviePremiere,
    handleDeleteMovie,
    handleGetMovieShowtimes,
    handleAddMovieShowtime,
    clearError,
    refreshData,
  };
};
