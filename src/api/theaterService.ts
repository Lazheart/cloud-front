import { theaterServiceClient } from './client';
import type { ApiResponse } from './client';

// Theater interfaces
export interface Theater {
  id: string;
  name: string;
  description?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  facilities: string[];
  images: string[];
  rating: number;
  totalRatings: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Hall {
  id: string;
  theaterId: string;
  name: string;
  capacity: number;
  seatLayout: SeatLayout;
  features: string[];
  isActive: boolean;
}

export interface SeatLayout {
  rows: number;
  seatsPerRow: number;
  seats: Seat[];
  aisles: number[];
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  type: 'regular' | 'premium' | 'vip' | 'wheelchair';
  isAvailable: boolean;
  price: number;
}

export interface Showtime {
  id: string;
  movieId: string;
  theaterId: string;
  hallId: string;
  date: string;
  time: string;
  endTime: string;
  price: {
    regular: number;
    premium: number;
    vip: number;
  };
  format: '2D' | '3D' | 'IMAX' | '4DX' | 'Dolby';
  language: string;
  subtitles?: string;
  availableSeats: number;
  totalSeats: number;
  isActive: boolean;
}

export interface ShowtimeFilters {
  movieId?: string;
  theaterId?: string;
  date?: string;
  timeFrom?: string;
  timeTo?: string;
  format?: string;
  language?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface TheaterFilters {
  city?: string;
  facilities?: string[];
  minRating?: number;
  coordinates?: {
    latitude: number;
    longitude: number;
    radius: number; // in kilometers
  };
}

export interface SeatAvailability {
  showtimeId: string;
  seats: {
    id: string;
    row: string;
    number: number;
    type: string;
    isAvailable: boolean;
    price: number;
    isReserved: boolean;
    reservedUntil?: string;
  }[];
  updatedAt: string;
}

// Theater Service
export class TheaterService {
  // Theater management
  async getTheaters(filters?: TheaterFilters): Promise<ApiResponse<Theater[]>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          if (typeof value === 'object') {
            params.append(key, JSON.stringify(value));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }
    return theaterServiceClient.get<Theater[]>(`/?${params.toString()}`);
  }

  async getTheaterById(theaterId: string): Promise<ApiResponse<Theater>> {
    return theaterServiceClient.get<Theater>(`/${theaterId}`);
  }

  async getTheatersByCity(city: string): Promise<ApiResponse<Theater[]>> {
    return theaterServiceClient.get<Theater[]>(`/city/${encodeURIComponent(city)}`);
  }

  async searchTheaters(query: string): Promise<ApiResponse<Theater[]>> {
    return theaterServiceClient.get<Theater[]>(`/search?q=${encodeURIComponent(query)}`);
  }

  // Hall management
  async getHallsByTheater(theaterId: string): Promise<ApiResponse<Hall[]>> {
    return theaterServiceClient.get<Hall[]>(`/${theaterId}/halls`);
  }

  async getHallById(theaterId: string, hallId: string): Promise<ApiResponse<Hall>> {
    return theaterServiceClient.get<Hall>(`/${theaterId}/halls/${hallId}`);
  }

  // Showtime management
  async getShowtimes(filters?: ShowtimeFilters): Promise<ApiResponse<Showtime[]>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    return theaterServiceClient.get<Showtime[]>(`/showtimes?${params.toString()}`);
  }

  async getShowtimeById(showtimeId: string): Promise<ApiResponse<Showtime>> {
    return theaterServiceClient.get<Showtime>(`/showtimes/${showtimeId}`);
  }

  async getShowtimesByMovie(movieId: string, filters?: Omit<ShowtimeFilters, 'movieId'>): Promise<ApiResponse<Showtime[]>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    return theaterServiceClient.get<Showtime[]>(`/showtimes/movie/${movieId}?${params.toString()}`);
  }

  async getShowtimesByTheater(theaterId: string, filters?: Omit<ShowtimeFilters, 'theaterId'>): Promise<ApiResponse<Showtime[]>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    return theaterServiceClient.get<Showtime[]>(`/${theaterId}/showtimes?${params.toString()}`);
  }

  // Seat management
  async getSeatAvailability(showtimeId: string): Promise<ApiResponse<SeatAvailability>> {
    return theaterServiceClient.get<SeatAvailability>(`/showtimes/${showtimeId}/seats`);
  }

  async reserveSeats(showtimeId: string, seatIds: string[]): Promise<ApiResponse<{ reservationId: string; reservedUntil: string }>> {
    return theaterServiceClient.post(`/showtimes/${showtimeId}/reserve`, { seatIds });
  }

  async releaseSeats(reservationId: string): Promise<ApiResponse<void>> {
    return theaterServiceClient.delete<void>(`/reservations/${reservationId}`);
  }

  // Cities and locations
  async getCities(): Promise<ApiResponse<string[]>> {
    return theaterServiceClient.get<string[]>('/cities');
  }

  async getPopularCities(): Promise<ApiResponse<{ city: string; theaterCount: number }[]>> {
    return theaterServiceClient.get<{ city: string; theaterCount: number }[]>('/cities/popular');
  }

  // Theater features and amenities
  async getAvailableFeatures(): Promise<ApiResponse<string[]>> {
    return theaterServiceClient.get<string[]>('/features');
  }

  async getAvailableFormats(): Promise<ApiResponse<string[]>> {
    return theaterServiceClient.get<string[]>('/formats');
  }

  // Theater ratings and reviews
  async getTheaterRatings(theaterId: string): Promise<ApiResponse<{
    averageRating: number;
    totalRatings: number;
    ratingDistribution: { rating: number; count: number }[];
  }>> {
    return theaterServiceClient.get(`/${theaterId}/ratings`);
  }

  async rateTheater(theaterId: string, rating: number, review?: string): Promise<ApiResponse<void>> {
    return theaterServiceClient.post<void>(`/${theaterId}/ratings`, { rating, review });
  }
}

// Export singleton instance
export const theaterService = new TheaterService();
export default theaterService;