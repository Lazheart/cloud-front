import { userServiceClient } from './client';
import type { ApiResponse } from './client';

// User interfaces
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: string;
  preferences?: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  language: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  favoriteGenres: string[];
  preferredTheaters: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  preferences?: Partial<UserPreferences>;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

// User Service
export class UserService {
  // Authentication
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return userServiceClient.post<LoginResponse>('/auth/login', credentials);
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<LoginResponse>> {
    return userServiceClient.post<LoginResponse>('/auth/register', userData);
  }

  async logout(): Promise<ApiResponse<void>> {
    return userServiceClient.post<void>('/auth/logout');
  }

  async refreshToken(refreshToken: string): Promise<ApiResponse<{ token: string; expiresIn: number }>> {
    return userServiceClient.post('/auth/refresh', { refreshToken });
  }

  async forgotPassword(request: ForgotPasswordRequest): Promise<ApiResponse<void>> {
    return userServiceClient.post<void>('/auth/forgot-password', request);
  }

  async resetPassword(request: ResetPasswordRequest): Promise<ApiResponse<void>> {
    return userServiceClient.post<void>('/auth/reset-password', request);
  }

  // Profile management
  async getProfile(): Promise<ApiResponse<User>> {
    return userServiceClient.get<User>('/profile');
  }

  async updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<User>> {
    return userServiceClient.patch<User>('/profile', data);
  }

  async changePassword(request: ChangePasswordRequest): Promise<ApiResponse<void>> {
    return userServiceClient.post<void>('/profile/change-password', request);
  }

  async uploadAvatar(file: File, onProgress?: (progress: number) => void): Promise<ApiResponse<{ avatarUrl: string }>> {
    return userServiceClient.upload<{ avatarUrl: string }>('/profile/avatar', file, onProgress);
  }

  async deleteAccount(): Promise<ApiResponse<void>> {
    return userServiceClient.delete<void>('/profile');
  }

  // Preferences
  async updatePreferences(preferences: Partial<UserPreferences>): Promise<ApiResponse<UserPreferences>> {
    return userServiceClient.patch<UserPreferences>('/profile/preferences', preferences);
  }

  // Account verification
  async verifyEmail(token: string): Promise<ApiResponse<void>> {
    return userServiceClient.post<void>('/auth/verify-email', { token });
  }

  async resendVerificationEmail(): Promise<ApiResponse<void>> {
    return userServiceClient.post<void>('/auth/resend-verification');
  }

  // Social features
  async getFavoriteMovies(): Promise<ApiResponse<string[]>> {
    return userServiceClient.get<string[]>('/favorites/movies');
  }

  async addFavoriteMovie(movieId: string): Promise<ApiResponse<void>> {
    return userServiceClient.post<void>(`/favorites/movies/${movieId}`);
  }

  async removeFavoriteMovie(movieId: string): Promise<ApiResponse<void>> {
    return userServiceClient.delete<void>(`/favorites/movies/${movieId}`);
  }

  async getFavoriteTheaters(): Promise<ApiResponse<string[]>> {
    return userServiceClient.get<string[]>('/favorites/theaters');
  }

  async addFavoriteTheater(theaterId: string): Promise<ApiResponse<void>> {
    return userServiceClient.post<void>(`/favorites/theaters/${theaterId}`);
  }

  async removeFavoriteTheater(theaterId: string): Promise<ApiResponse<void>> {
    return userServiceClient.delete<void>(`/favorites/theaters/${theaterId}`);
  }
}

// Export singleton instance
export const userService = new UserService();
export default userService;