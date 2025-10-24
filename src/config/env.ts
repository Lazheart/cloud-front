// Environment configuration
export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://lb-cinema-1751800337.us-east-1.elb.amazonaws.com',
    userService: import.meta.env.VITE_USER_SERVICE_URL || 'http://lb-cinema-1751800337.us-east-1.elb.amazonaws.com/users',
    theaterService: import.meta.env.VITE_THEATER_SERVICE_URL || 'http://lb-cinema-1751800337.us-east-1.elb.amazonaws.com/theaters',
    movieService: import.meta.env.VITE_MOVIE_SERVICE_URL || 'http://lb-cinema-1751800337.us-east-1.elb.amazonaws.com/movie',
    bookingService: import.meta.env.VITE_BOOKING_SERVICE_URL || 'http://lb-cinema-1751800337.us-east-1.elb.amazonaws.com/booking',
    paymentService: import.meta.env.VITE_PAYMENT_SERVICE_URL || 'http://lb-cinema-1751800337.us-east-1.elb.amazonaws.com/booking/payments',
    notificationService: import.meta.env.VITE_NOTIFICATION_SERVICE_URL || 'http://lb-cinema-1751800337.us-east-1.elb.amazonaws.com/analytics/notifications',
    databaseService: import.meta.env.VITE_DATABASE_SERVICE_URL || 'http://lb-cinema-1751800337.us-east-1.elb.amazonaws.com/analytics',
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