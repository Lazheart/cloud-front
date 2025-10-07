// Environment configuration
export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    userService: import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:3001/api/users',
    theaterService: import.meta.env.VITE_THEATER_SERVICE_URL || 'http://localhost:3002/api/theaters',
    movieService: import.meta.env.VITE_MOVIE_SERVICE_URL || 'http://localhost:3003/api/movies',
    bookingService: import.meta.env.VITE_BOOKING_SERVICE_URL || 'http://localhost:3004/api/bookings',
    paymentService: import.meta.env.VITE_PAYMENT_SERVICE_URL || 'http://localhost:3005/api/payments',
    notificationService: import.meta.env.VITE_NOTIFICATION_SERVICE_URL || 'http://localhost:3006/api/notifications',
  },
  app: {
    nodeEnv: import.meta.env.VITE_NODE_ENV || 'development',
    title: import.meta.env.VITE_APP_TITLE || 'Cinema Booking App',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  },
  isDevelopment: import.meta.env.VITE_NODE_ENV === 'development',
  isProduction: import.meta.env.VITE_NODE_ENV === 'production',
} as const;

export default config;