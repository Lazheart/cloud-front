import axios from 'axios';
import { setToken, removeToken } from '../utils/token';
import config from '../config/env';

// Types
export interface RegisterRequest {
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  phone_number: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    nombre: string;
    apellidos: string;
    email: string;
    phone_number: string;
    created_at: string;
  };
}

export interface AuthError {
  message: string;
  status: number;
  details?: any;
}

// Service response type
export interface ServiceResponse<T> {
  data: T | null;
  error: AuthError | null;
}

/**
 * Authentication Service
 * Handles user registration and login
 */
export class AuthService {
  private baseURL: string;

  constructor() {
    this.baseURL = config.api.userService;
  }

  /**
   * Register a new user
   * @param userData - User registration data
   * @returns ServiceResponse with user data or error
   */
  async registerService(userData: RegisterRequest): Promise<ServiceResponse<LoginResponse>> {
    try {
      const response = await axios.post(`${this.baseURL}/auth/register`, userData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        const loginData: LoginResponse = response.data;
        setToken(loginData.token);
        
        return {
          data: loginData,
          error: null,
        };
      }

      return {
        data: null,
        error: {
          message: 'Unexpected response status',
          status: response.status,
        },
      };
    } catch (error: any) {
      const authError: AuthError = {
        message: error.response?.data?.message || error.message || 'Registration failed',
        status: error.response?.status || 500,
        details: error.response?.data,
      };

      return {
        data: null,
        error: authError,
      };
    }
  }

  /**
   * Login user and get JWT token
   * @param credentials - User login credentials
   * @returns ServiceResponse with token and user data or error
   */
  async loginService(credentials: LoginRequest): Promise<ServiceResponse<LoginResponse>> {
    try {
      const response = await axios.post(`${this.baseURL}/auth/login`, credentials, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        const loginData: LoginResponse = response.data;
        setToken(loginData.token);
        
        return {
          data: loginData,
          error: null,
        };
      }

      return {
        data: null,
        error: {
          message: 'Unexpected response status',
          status: response.status,
        },
      };
    } catch (error: any) {
      const authError: AuthError = {
        message: error.response?.data?.message || error.message || 'Login failed',
        status: error.response?.status || 500,
        details: error.response?.data,
      };

      return {
        data: null,
        error: authError,
      };
    }
  }

  /**
   * Logout user and clear token
   * @returns ServiceResponse indicating success or error
   */
  async logoutService(): Promise<ServiceResponse<{ success: boolean }>> {
    try {
      removeToken();
      
      return {
        data: { success: true },
        error: null,
      };
    } catch (error: any) {
      return {
        data: null,
        error: {
          message: 'Logout failed',
          status: 500,
          details: error,
        },
      };
    }
  }

  /**
   * Check if user is currently authenticated
   * @returns boolean indicating authentication status
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    return token !== null && token.length > 0;
  }
}

// Export singleton instance
export const authService = new AuthService();

// Export individual functions for convenience
export const registerService = (userData: RegisterRequest) => authService.registerService(userData);
export const loginService = (credentials: LoginRequest) => authService.loginService(credentials);
export const logoutService = () => authService.logoutService();
