import { useState, useEffect } from 'react';
import { 
  authService, 
  RegisterRequest, 
  LoginRequest, 
  LoginResponse, 
  AuthError 
} from '../services/authService';
import { isAuthenticated } from '../utils/token';

// Hook state interface
export interface UseAuthState {
  data: LoginResponse | null;
  loading: boolean;
  error: AuthError | null;
  isAuthenticated: boolean;
}

// Hook return interface
export interface UseAuthReturn extends UseAuthState {
  handleLogin: (credentials: LoginRequest) => Promise<void>;
  handleRegister: (userData: RegisterRequest) => Promise<void>;
  handleLogout: () => Promise<void>;
  clearError: () => void;
}

/**
 * Authentication Hook
 * Manages user authentication state and operations
 */
export const useAuth = (): UseAuthReturn => {
  const [state, setState] = useState<UseAuthState>({
    data: null,
    loading: false,
    error: null,
    isAuthenticated: false,
  });

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setState(prev => ({
        ...prev,
        isAuthenticated: authenticated,
      }));
    };

    checkAuth();
  }, []);

  /**
   * Handle user login
   * @param credentials - Login credentials
   */
  const handleLogin = async (credentials: LoginRequest): Promise<void> => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await authService.loginService(credentials);
      
      if (response.error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error,
          isAuthenticated: false,
        }));
        return;
      }

      setState(prev => ({
        ...prev,
        data: response.data,
        loading: false,
        error: null,
        isAuthenticated: true,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: {
          message: 'Unexpected error during login',
          status: 500,
          details: error,
        },
        isAuthenticated: false,
      }));
    }
  };

  /**
   * Handle user registration
   * @param userData - Registration data
   */
  const handleRegister = async (userData: RegisterRequest): Promise<void> => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await authService.registerService(userData);
      
      if (response.error) {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.error,
          isAuthenticated: false,
        }));
        return;
      }

      setState(prev => ({
        ...prev,
        data: response.data,
        loading: false,
        error: null,
        isAuthenticated: true,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: {
          message: 'Unexpected error during registration',
          status: 500,
          details: error,
        },
        isAuthenticated: false,
      }));
    }
  };

  /**
   * Handle user logout
   */
  const handleLogout = async (): Promise<void> => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await authService.logoutService();
      
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
        data: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: {
          message: 'Unexpected error during logout',
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

  return {
    ...state,
    handleLogin,
    handleRegister,
    handleLogout,
    clearError,
  };
};
