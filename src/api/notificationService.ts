import { notificationServiceClient } from './client';
import type { ApiResponse } from './client';

// Notification interfaces
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, any>;
  priority: NotificationPriority;
  status: NotificationStatus;
  channel: NotificationChannel[];
  scheduledAt?: string;
  sentAt?: string;
  readAt?: string;
  clickedAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type NotificationType = 
  | 'booking_confirmation'
  | 'booking_reminder'
  | 'booking_cancellation'
  | 'payment_success'
  | 'payment_failed'
  | 'refund_processed'
  | 'movie_reminder'
  | 'show_availability'
  | 'price_drop'
  | 'new_movie_release'
  | 'promotional'
  | 'system_maintenance'
  | 'account_security'
  | 'general';

export type NotificationPriority = 'low' | 'normal' | 'high' | 'urgent';
export type NotificationStatus = 'pending' | 'sent' | 'delivered' | 'read' | 'clicked' | 'failed' | 'expired';
export type NotificationChannel = 'push' | 'email' | 'sms' | 'in_app';

export interface NotificationPreferences {
  userId: string;
  channels: {
    push: boolean;
    email: boolean;
    sms: boolean;
    inApp: boolean;
  };
  types: {
    [K in NotificationType]: {
      enabled: boolean;
      channels: NotificationChannel[];
      timing?: 'immediate' | 'batched' | 'scheduled';
    };
  };
  quietHours: {
    enabled: boolean;
    startTime: string; // HH:mm format
    endTime: string; // HH:mm format
    timezone: string;
  };
  frequency: {
    promotional: 'never' | 'weekly' | 'daily';
    marketing: 'never' | 'weekly' | 'monthly';
  };
  language: string;
  updatedAt: string;
}

export interface NotificationTemplate {
  id: string;
  type: NotificationType;
  name: string;
  subject: string;
  content: {
    html: string;
    text: string;
    push: string;
    sms: string;
  };
  variables: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationFilters {
  userId?: string;
  type?: NotificationType;
  status?: NotificationStatus;
  priority?: NotificationPriority;
  channel?: NotificationChannel;
  dateFrom?: string;
  dateTo?: string;
  isRead?: boolean;
  sortBy?: 'createdAt' | 'sentAt' | 'priority';
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

export interface NotificationStats {
  total: number;
  unread: number;
  byType: { type: NotificationType; count: number }[];
  byStatus: { status: NotificationStatus; count: number }[];
  recentActivity: {
    sent: number;
    delivered: number;
    read: number;
    clicked: number;
  };
}

export interface DeviceToken {
  userId: string;
  token: string;
  platform: 'ios' | 'android' | 'web';
  deviceId: string;
  isActive: boolean;
  registeredAt: string;
  lastUsedAt: string;
}

// Notification Service
export class NotificationService {
  // Device token management
  async registerDevice(deviceData: {
    token: string;
    platform: 'ios' | 'android' | 'web';
    deviceId: string;
  }): Promise<ApiResponse<DeviceToken>> {
    return notificationServiceClient.post<DeviceToken>('/devices/register', deviceData);
  }

  async unregisterDevice(deviceId: string): Promise<ApiResponse<void>> {
    return notificationServiceClient.delete<void>(`/devices/${deviceId}`);
  }

  async updateDeviceToken(deviceId: string, token: string): Promise<ApiResponse<DeviceToken>> {
    return notificationServiceClient.patch<DeviceToken>(`/devices/${deviceId}`, { token });
  }

  async getUserDevices(userId: string): Promise<ApiResponse<DeviceToken[]>> {
    return notificationServiceClient.get<DeviceToken[]>(`/devices/user/${userId}`);
  }

  // Notification management
  async getNotifications(filters?: NotificationFilters): Promise<ApiResponse<PaginatedResponse<Notification>>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }
    return notificationServiceClient.get<PaginatedResponse<Notification>>(`/?${params.toString()}`);
  }

  async getUserNotifications(userId: string, filters?: Omit<NotificationFilters, 'userId'>): Promise<ApiResponse<PaginatedResponse<Notification>>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(v => params.append(key, v.toString()));
          } else {
            params.append(key, value.toString());
          }
        }
      });
    }
    return notificationServiceClient.get<PaginatedResponse<Notification>>(`/user/${userId}?${params.toString()}`);
  }

  async getNotificationById(notificationId: string): Promise<ApiResponse<Notification>> {
    return notificationServiceClient.get<Notification>(`/${notificationId}`);
  }

  async markAsRead(notificationId: string): Promise<ApiResponse<Notification>> {
    return notificationServiceClient.patch<Notification>(`/${notificationId}/read`);
  }

  async markAsClicked(notificationId: string): Promise<ApiResponse<Notification>> {
    return notificationServiceClient.patch<Notification>(`/${notificationId}/clicked`);
  }

  async markAllAsRead(userId: string): Promise<ApiResponse<void>> {
    return notificationServiceClient.patch<void>(`/user/${userId}/read-all`);
  }

  async deleteNotification(notificationId: string): Promise<ApiResponse<void>> {
    return notificationServiceClient.delete<void>(`/${notificationId}`);
  }

  async deleteUserNotifications(userId: string, filters?: {
    type?: NotificationType;
    olderThan?: string;
    status?: NotificationStatus;
  }): Promise<ApiResponse<void>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    return notificationServiceClient.delete<void>(`/user/${userId}?${params.toString()}`);
  }

  // Sending notifications
  async sendNotification(notificationData: {
    userId: string | string[];
    type: NotificationType;
    title: string;
    message: string;
    data?: Record<string, any>;
    priority?: NotificationPriority;
    channels?: NotificationChannel[];
    scheduledAt?: string;
    expiresAt?: string;
  }): Promise<ApiResponse<Notification | Notification[]>> {
    return notificationServiceClient.post('/send', notificationData);
  }

  async sendBulkNotification(notificationData: {
    userIds: string[];
    type: NotificationType;
    title: string;
    message: string;
    data?: Record<string, any>;
    priority?: NotificationPriority;
    channels?: NotificationChannel[];
    scheduledAt?: string;
    expiresAt?: string;
  }): Promise<ApiResponse<{
    sent: number;
    failed: number;
    notificationIds: string[];
  }>> {
    return notificationServiceClient.post('/send-bulk', notificationData);
  }

  async sendTemplatedNotification(templateData: {
    userId: string | string[];
    templateId: string;
    variables: Record<string, string>;
    priority?: NotificationPriority;
    channels?: NotificationChannel[];
    scheduledAt?: string;
  }): Promise<ApiResponse<Notification | Notification[]>> {
    return notificationServiceClient.post('/send-template', templateData);
  }

  // Notification preferences
  async getPreferences(userId: string): Promise<ApiResponse<NotificationPreferences>> {
    return notificationServiceClient.get<NotificationPreferences>(`/preferences/${userId}`);
  }

  async updatePreferences(userId: string, preferences: Partial<NotificationPreferences>): Promise<ApiResponse<NotificationPreferences>> {
    return notificationServiceClient.patch<NotificationPreferences>(`/preferences/${userId}`, preferences);
  }

  async resetPreferences(userId: string): Promise<ApiResponse<NotificationPreferences>> {
    return notificationServiceClient.post<NotificationPreferences>(`/preferences/${userId}/reset`);
  }

  // Statistics and analytics
  async getNotificationStats(userId: string): Promise<ApiResponse<NotificationStats>> {
    return notificationServiceClient.get<NotificationStats>(`/stats/user/${userId}`);
  }

  async getGlobalStats(dateFrom?: string, dateTo?: string): Promise<ApiResponse<{
    totalSent: number;
    deliveryRate: number;
    readRate: number;
    clickRate: number;
    byChannel: { channel: NotificationChannel; sent: number; delivered: number }[];
    byType: { type: NotificationType; sent: number; read: number }[];
    topPerformers: { type: NotificationType; clickRate: number }[];
  }>> {
    const params = new URLSearchParams();
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);
    return notificationServiceClient.get(`/stats/global?${params.toString()}`);
  }

  // Templates
  async getTemplates(): Promise<ApiResponse<NotificationTemplate[]>> {
    return notificationServiceClient.get<NotificationTemplate[]>('/templates');
  }

  async getTemplateById(templateId: string): Promise<ApiResponse<NotificationTemplate>> {
    return notificationServiceClient.get<NotificationTemplate>(`/templates/${templateId}`);
  }

  async createTemplate(template: Omit<NotificationTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<NotificationTemplate>> {
    return notificationServiceClient.post<NotificationTemplate>('/templates', template);
  }

  async updateTemplate(templateId: string, template: Partial<NotificationTemplate>): Promise<ApiResponse<NotificationTemplate>> {
    return notificationServiceClient.patch<NotificationTemplate>(`/templates/${templateId}`, template);
  }

  async deleteTemplate(templateId: string): Promise<ApiResponse<void>> {
    return notificationServiceClient.delete<void>(`/templates/${templateId}`);
  }

  // Scheduled notifications
  async getScheduledNotifications(userId?: string): Promise<ApiResponse<Notification[]>> {
    const params = userId ? `?userId=${userId}` : '';
    return notificationServiceClient.get<Notification[]>(`/scheduled${params}`);
  }

  async cancelScheduledNotification(notificationId: string): Promise<ApiResponse<void>> {
    return notificationServiceClient.patch<void>(`/${notificationId}/cancel`);
  }

  async rescheduleNotification(notificationId: string, newScheduleTime: string): Promise<ApiResponse<Notification>> {
    return notificationServiceClient.patch<Notification>(`/${notificationId}/reschedule`, {
      scheduledAt: newScheduleTime
    });
  }

  // Booking-specific notifications
  async sendBookingConfirmation(bookingId: string): Promise<ApiResponse<Notification>> {
    return notificationServiceClient.post<Notification>('/booking/confirmation', { bookingId });
  }

  async sendBookingReminder(bookingId: string, minutesBefore: number): Promise<ApiResponse<Notification>> {
    return notificationServiceClient.post<Notification>('/booking/reminder', {
      bookingId,
      minutesBefore
    });
  }

  async sendPaymentNotification(paymentId: string, status: 'success' | 'failed'): Promise<ApiResponse<Notification>> {
    return notificationServiceClient.post<Notification>('/payment/status', {
      paymentId,
      status
    });
  }

  async sendMovieAvailabilityAlert(userId: string, movieId: string, theaterId?: string): Promise<ApiResponse<Notification>> {
    return notificationServiceClient.post<Notification>('/movie/availability', {
      userId,
      movieId,
      theaterId
    });
  }

  // Subscription management
  async subscribeToMovieUpdates(userId: string, movieId: string): Promise<ApiResponse<void>> {
    return notificationServiceClient.post<void>('/subscriptions/movie', {
      userId,
      movieId
    });
  }

  async unsubscribeFromMovieUpdates(userId: string, movieId: string): Promise<ApiResponse<void>> {
    return notificationServiceClient.delete<void>(`/subscriptions/movie/${userId}/${movieId}`);
  }

  async subscribeToTheaterUpdates(userId: string, theaterId: string): Promise<ApiResponse<void>> {
    return notificationServiceClient.post<void>('/subscriptions/theater', {
      userId,
      theaterId
    });
  }

  async unsubscribeFromTheaterUpdates(userId: string, theaterId: string): Promise<ApiResponse<void>> {
    return notificationServiceClient.delete<void>(`/subscriptions/theater/${userId}/${theaterId}`);
  }

  async getSubscriptions(userId: string): Promise<ApiResponse<{
    movies: string[];
    theaters: string[];
    genres: string[];
  }>> {
    return notificationServiceClient.get(`/subscriptions/${userId}`);
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
export default notificationService;