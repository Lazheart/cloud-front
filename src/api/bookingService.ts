import { bookingServiceClient } from './client';
import type { ApiResponse } from './client';

// Booking interfaces
export interface Booking {
  id: string;
  userId: string;
  showtimeId: string;
  movieId: string;
  theaterId: string;
  seats: BookingSeat[];
  totalAmount: number;
  discount?: number;
  taxes: number;
  finalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  bookingReference: string;
  qrCode?: string;
  expiresAt: string;
  bookedAt: string;
  cancelledAt?: string;
  refundedAt?: string;
  movie: BookingMovie;
  theater: BookingTheater;
  showtime: BookingShowtime;
  payment?: Payment;
}

export interface BookingSeat {
  id: string;
  seatNumber: string;
  seatType: 'standard' | 'premium' | 'vip' | 'recliner';
  price: number;
  row: string;
  column: number;
}

export interface BookingMovie {
  id: string;
  title: string;
  poster: string;
  duration: number;
  rating: string;
  genres: string[];
}

export interface BookingTheater {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  hallName: string;
  hallNumber: string;
}

export interface BookingShowtime {
  id: string;
  startTime: string;
  endTime: string;
  date: string;
  language: string;
  format: '2D' | '3D' | 'IMAX' | 'DOLBY';
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  gateway: PaymentGateway;
  processedAt?: string;
  refundedAt?: string;
  refundAmount?: number;
  failureReason?: string;
}

export type PaymentMethod = 'credit_card' | 'debit_card' | 'digital_wallet' | 'net_banking' | 'upi' | 'cash';
export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled' | 'refunded' | 'partially_refunded';
export type BookingStatus = 'confirmed' | 'pending' | 'cancelled' | 'expired' | 'used' | 'refunded';
export type PaymentGateway = 'stripe' | 'razorpay' | 'paypal' | 'square' | 'paytm';

export interface BookingRequest {
  showtimeId: string;
  seatIds: string[];
  paymentMethod: PaymentMethod;
  paymentGateway: PaymentGateway;
  discountCode?: string;
  specialRequests?: string;
}

export interface BookingFilters {
  userId?: string;
  movieId?: string;
  theaterId?: string;
  status?: BookingStatus;
  paymentStatus?: PaymentStatus;
  dateFrom?: string;
  dateTo?: string;
  bookedFrom?: string;
  bookedTo?: string;
  sortBy?: 'bookedAt' | 'showtime' | 'amount' | 'status';
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

export interface BookingStats {
  totalBookings: number;
  totalRevenue: number;
  averageBookingValue: number;
  cancelledBookings: number;
  refundedAmount: number;
  upcomingBookings: number;
  todayBookings: number;
}

export interface DiscountCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  applicableMovies?: string[];
  applicableTheaters?: string[];
}

export interface SeatHold {
  id: string;
  showtimeId: string;
  seatIds: string[];
  userId: string;
  expiresAt: string;
  createdAt: string;
}

// Booking Service
export class BookingService {
  // Seat management
  async holdSeats(showtimeId: string, seatIds: string[]): Promise<ApiResponse<SeatHold>> {
    return bookingServiceClient.post<SeatHold>('/seats/hold', {
      showtimeId,
      seatIds
    });
  }

  async releaseSeats(holdId: string): Promise<ApiResponse<void>> {
    return bookingServiceClient.delete<void>(`/seats/hold/${holdId}`);
  }

  async extendSeatHold(holdId: string, minutes: number = 5): Promise<ApiResponse<SeatHold>> {
    return bookingServiceClient.patch<SeatHold>(`/seats/hold/${holdId}/extend`, {
      minutes
    });
  }

  // Booking creation and management
  async createBooking(bookingRequest: BookingRequest): Promise<ApiResponse<Booking>> {
    return bookingServiceClient.post<Booking>('/', bookingRequest);
  }

  async getBookingById(bookingId: string): Promise<ApiResponse<Booking>> {
    return bookingServiceClient.get<Booking>(`/${bookingId}`);
  }

  async getBookingByReference(reference: string): Promise<ApiResponse<Booking>> {
    return bookingServiceClient.get<Booking>(`/reference/${reference}`);
  }

  async getUserBookings(userId: string, filters?: Omit<BookingFilters, 'userId'>): Promise<ApiResponse<PaginatedResponse<Booking>>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    return bookingServiceClient.get<PaginatedResponse<Booking>>(`/user/${userId}?${params.toString()}`);
  }

  async getBookings(filters?: BookingFilters): Promise<ApiResponse<PaginatedResponse<Booking>>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    return bookingServiceClient.get<PaginatedResponse<Booking>>(`/?${params.toString()}`);
  }

  // Booking modifications
  async cancelBooking(bookingId: string, reason?: string): Promise<ApiResponse<Booking>> {
    return bookingServiceClient.patch<Booking>(`/${bookingId}/cancel`, {
      reason
    });
  }

  async refundBooking(bookingId: string, amount?: number, reason?: string): Promise<ApiResponse<Booking>> {
    return bookingServiceClient.patch<Booking>(`/${bookingId}/refund`, {
      amount,
      reason
    });
  }

  async updateBookingSeats(bookingId: string, newSeatIds: string[]): Promise<ApiResponse<Booking>> {
    return bookingServiceClient.patch<Booking>(`/${bookingId}/seats`, {
      seatIds: newSeatIds
    });
  }

  // Payment processing
  async processPayment(bookingId: string, paymentDetails: {
    method: PaymentMethod;
    gateway: PaymentGateway;
    token?: string;
    cardDetails?: {
      number: string;
      expiryMonth: number;
      expiryYear: number;
      cvv: string;
      holderName: string;
    };
    upiId?: string;
    walletProvider?: string;
  }): Promise<ApiResponse<Payment>> {
    return bookingServiceClient.post<Payment>(`/${bookingId}/payment`, paymentDetails);
  }

  async getPaymentStatus(bookingId: string): Promise<ApiResponse<Payment>> {
    return bookingServiceClient.get<Payment>(`/${bookingId}/payment`);
  }

  async retryPayment(bookingId: string): Promise<ApiResponse<Payment>> {
    return bookingServiceClient.post<Payment>(`/${bookingId}/payment/retry`);
  }

  // Discount and pricing
  async validateDiscountCode(code: string, showtimeId: string, seatIds: string[]): Promise<ApiResponse<{
    isValid: boolean;
    discount: DiscountCode;
    discountAmount: number;
    finalAmount: number;
  }>> {
    return bookingServiceClient.post('/discount/validate', {
      code,
      showtimeId,
      seatIds
    });
  }

  async calculateBookingAmount(showtimeId: string, seatIds: string[], discountCode?: string): Promise<ApiResponse<{
    subtotal: number;
    discount: number;
    taxes: number;
    convenienceFee: number;
    total: number;
    breakdown: {
      seatCharges: { seatId: string; price: number }[];
      discountApplied?: DiscountCode;
    };
  }>> {
    return bookingServiceClient.post('/calculate', {
      showtimeId,
      seatIds,
      discountCode
    });
  }

  async getAvailableDiscounts(showtimeId: string): Promise<ApiResponse<DiscountCode[]>> {
    return bookingServiceClient.get<DiscountCode[]>(`/discounts/available?showtimeId=${showtimeId}`);
  }

  // Booking confirmation and tickets
  async confirmBooking(bookingId: string): Promise<ApiResponse<Booking>> {
    return bookingServiceClient.patch<Booking>(`/${bookingId}/confirm`);
  }

  async generateTicket(bookingId: string): Promise<ApiResponse<{
    ticketUrl: string;
    qrCode: string;
    ticketData: Booking;
  }>> {
    return bookingServiceClient.get(`/${bookingId}/ticket`);
  }

  async sendTicketEmail(bookingId: string, email?: string): Promise<ApiResponse<void>> {
    return bookingServiceClient.post<void>(`/${bookingId}/ticket/email`, {
      email
    });
  }

  async sendTicketSMS(bookingId: string, phoneNumber?: string): Promise<ApiResponse<void>> {
    return bookingServiceClient.post<void>(`/${bookingId}/ticket/sms`, {
      phoneNumber
    });
  }

  // Booking statistics and analytics
  async getBookingStats(userId?: string, dateFrom?: string, dateTo?: string): Promise<ApiResponse<BookingStats>> {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);
    return bookingServiceClient.get<BookingStats>(`/stats?${params.toString()}`);
  }

  async getUpcomingBookings(userId: string, limit: number = 5): Promise<ApiResponse<Booking[]>> {
    return bookingServiceClient.get<Booking[]>(`/user/${userId}/upcoming?limit=${limit}`);
  }

  async getBookingHistory(userId: string, page: number = 1, limit: number = 10): Promise<ApiResponse<PaginatedResponse<Booking>>> {
    return bookingServiceClient.get<PaginatedResponse<Booking>>(`/user/${userId}/history?page=${page}&limit=${limit}`);
  }

  // Booking reminders and notifications
  async setBookingReminder(bookingId: string, reminderTime: number): Promise<ApiResponse<void>> {
    return bookingServiceClient.post<void>(`/${bookingId}/reminder`, {
      minutesBefore: reminderTime
    });
  }

  async getBookingReminders(userId: string): Promise<ApiResponse<{
    bookingId: string;
    reminderTime: string;
    movieTitle: string;
    theaterName: string;
  }[]>> {
    return bookingServiceClient.get(`/user/${userId}/reminders`);
  }

  // Waitlist and availability
  async joinWaitlist(showtimeId: string, seatPreferences: {
    seatType?: 'standard' | 'premium' | 'vip' | 'recliner';
    maxPrice?: number;
    preferredRows?: string[];
  }): Promise<ApiResponse<{
    waitlistId: string;
    position: number;
    estimatedWaitTime: number;
  }>> {
    return bookingServiceClient.post('/waitlist/join', {
      showtimeId,
      ...seatPreferences
    });
  }

  async leaveWaitlist(waitlistId: string): Promise<ApiResponse<void>> {
    return bookingServiceClient.delete<void>(`/waitlist/${waitlistId}`);
  }

  async getWaitlistStatus(waitlistId: string): Promise<ApiResponse<{
    position: number;
    estimatedWaitTime: number;
    availableSeats: number;
  }>> {
    return bookingServiceClient.get(`/waitlist/${waitlistId}/status`);
  }
}

// Export singleton instance
export const bookingService = new BookingService();
export default bookingService;