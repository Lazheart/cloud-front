import axios from 'axios';
import { getAuthHeader } from '../utils/token';
import config from '../config/env';

// Types
export interface User {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  phone_number: string;
  created_at: string;
}

export interface UpdateProfileRequest {
  nombre?: string;
  apellidos?: string;
  phone_number?: string;
}

export interface UpdatePasswordRequest {
  current_password: string;
  new_password: string;
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
 * User Service
 * Handles user profile management
 */
export class UserService {
  private baseURL: string;

  constructor() {
    this.baseURL = config.api.userService;
  }

  /**
   * Get authorization headers with JWT token
   * @returns Headers object with Authorization header
   */
  private getAuthHeaders() {
    const authHeader = getAuthHeader();
    if (!authHeader) {
      throw new Error('No authentication token found');
    }

    return {
      'Content-Type': 'application/json',
      'Authorization': authHeader,
    };
  }

  /**
   * Get all users (admin function)
   * @returns ServiceResponse with array of users or error
   */
  async getAllUsersService(): Promise<ServiceResponse<User[]>> {
    try {
      const response = await axios.get(`${this.baseURL}/users`, {
        headers: this.getAuthHeaders(),
      });

      return {
        data: response.data,
        error: null,
      };
    } catch (error: any) {
      const serviceError: ServiceError = {
        message: error.response?.data?.message || error.message || 'Failed to fetch users',
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
   * Get current user profile
   * @returns ServiceResponse with user profile or error
   */
  async getProfileService(): Promise<ServiceResponse<User>> {
    try {
      const response = await axios.get(`${this.baseURL}/users/profile`, {
        headers: this.getAuthHeaders(),
      });

      return {
        data: response.data,
        error: null,
      };
    } catch (error: any) {
      const serviceError: ServiceError = {
        message: error.response?.data?.message || error.message || 'Failed to fetch profile',
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
   * Update user profile
   * @param profileData - Profile data to update
   * @returns ServiceResponse with updated user profile or error
   */
  async updateProfileService(profileData: UpdateProfileRequest): Promise<ServiceResponse<User>> {
    try {
      const response = await axios.put(`${this.baseURL}/users/profile`, profileData, {
        headers: this.getAuthHeaders(),
      });

      return {
        data: response.data,
        error: null,
      };
    } catch (error: any) {
      const serviceError: ServiceError = {
        message: error.response?.data?.message || error.message || 'Failed to update profile',
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
   * Update user password
   * @param passwordData - Password update data
   * @returns ServiceResponse indicating success or error
   */
  async updatePasswordService(passwordData: UpdatePasswordRequest): Promise<ServiceResponse<{ success: boolean }>> {
    try {
      const response = await axios.put(`${this.baseURL}/users/profile/password`, passwordData, {
        headers: this.getAuthHeaders(),
      });

      return {
        data: { success: true },
        error: null,
      };
    } catch (error: any) {
      const serviceError: ServiceError = {
        message: error.response?.data?.message || error.message || 'Failed to update password',
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
export const userService = new UserService();

// Export individual functions for convenience
export const getAllUsersService = () => userService.getAllUsersService();
export const getProfileService = () => userService.getProfileService();
export const updateProfileService = (data: UpdateProfileRequest) => userService.updateProfileService(data);
export const updatePasswordService = (data: UpdatePasswordRequest) => userService.updatePasswordService(data);
