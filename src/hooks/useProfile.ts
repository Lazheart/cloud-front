import { useState, useEffect } from 'react';
import { 
  userService, 
  User, 
  UpdateProfileRequest, 
  UpdatePasswordRequest, 
  ServiceError 
} from '../services/userService';
import { isAuthenticated } from '../utils/token';

// Hook state interface
export interface UseProfileState {
  data: User | null;
  loading: boolean;
  error: ServiceError | null;
  isAuthenticated: boolean;
}

// Hook return interface
export interface UseProfileReturn extends UseProfileState {
  handleGetProfile: () => Promise<void>;
  handleUpdateProfile: (data: UpdateProfileRequest) => Promise<void>;
  handleUpdatePassword: (data: UpdatePasswordRequest) => Promise<void>;
  clearError: () => void;
  refreshProfile: () => Promise<void>;
}

/**
 * Profile Management Hook
 * Manages user profile state and operations
 */
export const useProfile = (): UseProfileReturn => {
  const [state, setState] = useState<UseProfileState>({
    data: null,
    loading: false,
    error: null,
    isAuthenticated: false,
  });

  // Check authentication status and load profile on mount
  useEffect(() => {
    const checkAuthAndLoadProfile = async () => {
      const authenticated = isAuthenticated();
      setState(prev => ({
        ...prev,
        isAuthenticated: authenticated,
      }));

      if (authenticated) {
        await handleGetProfile();
      }
    };

    checkAuthAndLoadProfile();
  }, []);

  /**
   * Get user profile
   */
  const handleGetProfile = async (): Promise<void> => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await userService.getProfileService();
      
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
          message: 'Unexpected error fetching profile',
          status: 500,
          details: error,
        },
      }));
    }
  };

  /**
   * Update user profile
   * @param data - Profile data to update
   */
  const handleUpdateProfile = async (data: UpdateProfileRequest): Promise<void> => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await userService.updateProfileService(data);
      
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
          message: 'Unexpected error updating profile',
          status: 500,
          details: error,
        },
      }));
    }
  };

  /**
   * Update user password
   * @param data - Password update data
   */
  const handleUpdatePassword = async (data: UpdatePasswordRequest): Promise<void> => {
    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await userService.updatePasswordService(data);
      
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
        loading: false,
        error: null,
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: {
          message: 'Unexpected error updating password',
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
   * Refresh profile data
   */
  const refreshProfile = async (): Promise<void> => {
    await handleGetProfile();
  };

  return {
    ...state,
    handleGetProfile,
    handleUpdateProfile,
    handleUpdatePassword,
    clearError,
    refreshProfile,
  };
};
