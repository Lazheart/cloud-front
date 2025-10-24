import axios from 'axios';
import config from '../config/env';

// Types for Bookings API
export interface Seat {
  seat_row: string;
  seat_number: number;
}

export interface User {
  user_id: string;
  name: string;
  email: string;
}

export interface Booking {
  _id: string;
  showtime_id: string;
  movie_id: string;
  cinema_id: string;
  sala_id: string;
  sala_number: number;
  seats: Seat[];
  user: User;
  payment_method: string;
  source: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REFUNDED';
  price_total: number;
  currency: string;
  created_at?: string;
}

export interface BookingFilters {
  limit?: number;
  page?: number;
  status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'REFUNDED';
}

export interface BookingsListResponse {
  page: number;
  limit: number;
  count: number;
  data: Booking[];
}

export interface HealthResponse {
  ok: boolean;
}

export interface ErrorResponse {
  error: string;
  detail: string;
  key?: Record<string, any>;
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
 * Bookings Service
 * Handles bookings operations through REST API
 */
export class BookingsService {
  private baseURL: string;

  constructor() {
    this.baseURL = config.api.bookingService;
  }

  /**
   * Check bookings service health
   * @returns ServiceResponse with health status
   */
  async checkHealthService(): Promise<ServiceResponse<HealthResponse>> {
    try {
      const response = await axios.get(`${this.baseURL}/health`, {
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
        message: error.response?.data?.detail || error.message || 'Failed to check bookings service health',
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
   * Get paginated list of bookings
   * @param filters - Query parameters for filtering
   * @returns ServiceResponse with bookings list
   */
  async getBookingsService(filters?: BookingFilters): Promise<ServiceResponse<BookingsListResponse>> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString());
          }
        });
      }

      const response = await axios.get(`${this.baseURL}/bookings?${params.toString()}`, {
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
        message: error.response?.data?.detail || error.message || 'Failed to fetch bookings',
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
   * Create a new booking
   * @param bookingData - Booking data to create
   * @returns ServiceResponse with created booking
   */
  async createBookingService(bookingData: Booking): Promise<ServiceResponse<Booking>> {
    try {
      const response = await axios.post(`${this.baseURL}/bookings`, bookingData, {
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
        message: error.response?.data?.detail || error.message || 'Failed to create booking',
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
   * Get a booking by ID
   * @param id - Booking ID
   * @returns ServiceResponse with booking data
   */
  async getBookingByIdService(id: string): Promise<ServiceResponse<Booking>> {
    try {
      const response = await axios.get(`${this.baseURL}/bookings/${id}`, {
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
        message: error.response?.data?.detail || error.message || 'Failed to fetch booking',
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
   * Update a booking partially
   * @param id - Booking ID
   * @param updateData - Partial booking data to update
   * @returns ServiceResponse with updated booking
   */
  async updateBookingService(id: string, updateData: Partial<Booking>): Promise<ServiceResponse<Booking>> {
    try {
      const response = await axios.patch(`${this.baseURL}/bookings/${id}`, updateData, {
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
        message: error.response?.data?.detail || error.message || 'Failed to update booking',
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
   * Replace a booking completely
   * @param id - Booking ID
   * @param bookingData - Complete booking data
   * @returns ServiceResponse with replaced booking
   */
  async replaceBookingService(id: string, bookingData: Booking): Promise<ServiceResponse<Booking>> {
    try {
      const response = await axios.put(`${this.baseURL}/bookings/${id}`, bookingData, {
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
        message: error.response?.data?.detail || error.message || 'Failed to replace booking',
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
   * Delete a booking
   * @param id - Booking ID
   * @returns ServiceResponse indicating success
   */
  async deleteBookingService(id: string): Promise<ServiceResponse<{ success: boolean }>> {
    try {
      const response = await axios.delete(`${this.baseURL}/bookings/${id}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      return {
        data: { success: true },
        error: null,
      };
    } catch (error: any) {
      const serviceError: ServiceError = {
        message: error.response?.data?.detail || error.message || 'Failed to delete booking',
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
export const bookingsService = new BookingsService();

// Export individual functions for convenience
export const checkHealthService = () => bookingsService.checkHealthService();
export const getBookingsService = (filters?: BookingFilters) => bookingsService.getBookingsService(filters);
export const createBookingService = (data: Booking) => bookingsService.createBookingService(data);
export const getBookingByIdService = (id: string) => bookingsService.getBookingByIdService(id);
export const updateBookingService = (id: string, data: Partial<Booking>) => bookingsService.updateBookingService(id, data);
export const replaceBookingService = (id: string, data: Booking) => bookingsService.replaceBookingService(id, data);
export const deleteBookingService = (id: string) => bookingsService.deleteBookingService(id);
