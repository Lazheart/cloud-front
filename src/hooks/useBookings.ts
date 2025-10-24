import { useState, useEffect } from 'react';
import { 
  bookingsService, 
  Booking, 
  BookingFilters, 
  BookingsListResponse, 
  HealthResponse, 
  ServiceError 
} from '../services/bookingsService';

// Hook state interface
export interface UseBookingsState {
  data: any;
  loading: boolean;
  error: ServiceError | null;
  health: HealthResponse | null;
}

// Hook return interface
export interface UseBookingsReturn extends UseBookingsState {
  handleCheckHealth: () => Promise<void>;
  handleGetBookings: (filters?: BookingFilters) => Promise<void>;
  handleCreateBooking: (data: Booking) => Promise<void>;
  handleGetBookingById: (id: string) => Promise<void>;
  handleUpdateBooking: (id: string, data: Partial<Booking>) => Promise<void>;
  handleReplaceBooking: (id: string, data: Booking) => Promise<void>;
  handleDeleteBooking: (id: string) => Promise<void>;
  clearError: () => void;
  refreshData: () => Promise<void>;
}

/**
 * Bookings Management Hook
 * Manages bookings operations and state
 */
export const useBookings = (): UseBookingsReturn => {
  const [state, setState] = useState<UseBookingsState>({
    data: null,
    loading: false,
    error: null,
    health: null,
  });

  // Check service health on mount
  useEffect(() => {
    const checkHealth = async () => {
      await handleCheckHealth();
    };

    checkHealth();
  }, []);

  /**
   * Check bookings service health
   */
  const handleCheckHealth = async (): Promise<void> => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await bookingsService.checkHealthService();
      
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
        health: response.data,
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: {
          message: 'Unexpected error checking bookings service health',
          status: 500,
          details: error,
        },
      }));
    }
  };

  /**
   * Get paginated list of bookings
   * @param filters - Query parameters for filtering
   */
  const handleGetBookings = async (filters?: BookingFilters): Promise<void> => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await bookingsService.getBookingsService(filters);
      
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
          message: 'Unexpected error fetching bookings',
          status: 500,
          details: error,
        },
      }));
    }
  };

  /**
   * Create a new booking
   * @param data - Booking data to create
   */
  const handleCreateBooking = async (data: Booking): Promise<void> => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await bookingsService.createBookingService(data);
      
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
          message: 'Unexpected error creating booking',
          status: 500,
          details: error,
        },
      }));
    }
  };

  /**
   * Get a booking by ID
   * @param id - Booking ID
   */
  const handleGetBookingById = async (id: string): Promise<void> => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await bookingsService.getBookingByIdService(id);
      
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
          message: 'Unexpected error fetching booking',
          status: 500,
          details: error,
        },
      }));
    }
  };

  /**
   * Update a booking partially
   * @param id - Booking ID
   * @param data - Partial booking data to update
   */
  const handleUpdateBooking = async (id: string, data: Partial<Booking>): Promise<void> => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await bookingsService.updateBookingService(id, data);
      
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
          message: 'Unexpected error updating booking',
          status: 500,
          details: error,
        },
      }));
    }
  };

  /**
   * Replace a booking completely
   * @param id - Booking ID
   * @param data - Complete booking data
   */
  const handleReplaceBooking = async (id: string, data: Booking): Promise<void> => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await bookingsService.replaceBookingService(id, data);
      
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
          message: 'Unexpected error replacing booking',
          status: 500,
          details: error,
        },
      }));
    }
  };

  /**
   * Delete a booking
   * @param id - Booking ID
   */
  const handleDeleteBooking = async (id: string): Promise<void> => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await bookingsService.deleteBookingService(id);
      
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
          message: 'Unexpected error deleting booking',
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
   * Refresh data by checking health
   */
  const refreshData = async (): Promise<void> => {
    await handleCheckHealth();
  };

  return {
    ...state,
    handleCheckHealth,
    handleGetBookings,
    handleCreateBooking,
    handleGetBookingById,
    handleUpdateBooking,
    handleReplaceBooking,
    handleDeleteBooking,
    clearError,
    refreshData,
  };
};
