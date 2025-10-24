// Environment configuration
export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    userService: import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:5000',
    theaterService: import.meta.env.VITE_THEATER_SERVICE_URL || 'http://localhost:8001',
    movieService: import.meta.env.VITE_MOVIE_SERVICE_URL || 'http://localhost:8080',
    bookingService: import.meta.env.VITE_BOOKING_SERVICE_URL || 'http://localhost:3000',
    paymentService: import.meta.env.VITE_PAYMENT_SERVICE_URL || 'http://localhost:3000/payments',
    notificationService: import.meta.env.VITE_NOTIFICATION_SERVICE_URL || 'http://localhost:8085/notifications',
    databaseService: import.meta.env.VITE_DATABASE_SERVICE_URL || 'http://localhost:8085',
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