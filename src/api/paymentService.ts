import { paymentServiceClient } from './client';
import type { ApiResponse } from './client';

// Payment interfaces
export interface Payment {
  id: string;
  bookingId: string;
  userId: string;
  amount: number;
  currency: string;
  method: PaymentMethod;
  gateway: PaymentGateway;
  status: PaymentStatus;
  transactionId?: string;
  gatewayTransactionId?: string;
  gatewayResponse?: Record<string, any>;
  failureReason?: string;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  processedAt?: string;
  refunds: PaymentRefund[];
}

export interface PaymentRefund {
  id: string;
  paymentId: string;
  amount: number;
  reason: string;
  status: RefundStatus;
  gatewayRefundId?: string;
  processedAt?: string;
  createdAt: string;
}

export type PaymentMethod = 
  | 'credit_card'
  | 'debit_card'
  | 'digital_wallet'
  | 'net_banking'
  | 'upi'
  | 'emi'
  | 'gift_card'
  | 'loyalty_points'
  | 'cash';

export type PaymentGateway = 
  | 'stripe'
  | 'razorpay'
  | 'paypal'
  | 'square'
  | 'paytm'
  | 'phonepe'
  | 'gpay'
  | 'amazon_pay';

export type PaymentStatus = 
  | 'pending'
  | 'processing'
  | 'authorized'
  | 'captured'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'expired'
  | 'disputed'
  | 'refunded'
  | 'partially_refunded';

export type RefundStatus = 
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface PaymentRequest {
  bookingId: string;
  amount: number;
  currency?: string;
  method: PaymentMethod;
  gateway: PaymentGateway;
  paymentDetails: PaymentDetails;
  billingAddress?: BillingAddress;
  metadata?: Record<string, any>;
  savePaymentMethod?: boolean;
}

export interface PaymentDetails {
  // Credit/Debit Card
  cardNumber?: string;
  expiryMonth?: number;
  expiryYear?: number;
  cvv?: string;
  cardholderName?: string;
  
  // Digital Wallet
  walletProvider?: string;
  walletToken?: string;
  
  // UPI
  upiId?: string;
  
  // Net Banking
  bankCode?: string;
  
  // EMI
  emiTenure?: number;
  
  // Gift Card
  giftCardNumber?: string;
  giftCardPin?: string;
  
  // Loyalty Points
  pointsToRedeem?: number;
}

export interface BillingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface SavedPaymentMethod {
  id: string;
  userId: string;
  type: PaymentMethodType;
  provider: PaymentGateway;
  isDefault: boolean;
  details: SavedPaymentDetails;
  createdAt: string;
  lastUsedAt?: string;
  expiresAt?: string;
}

export type PaymentMethodType = 'card' | 'wallet' | 'bank_account' | 'upi';

export interface SavedPaymentDetails {
  // Masked card details
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  cardholderName?: string;
  
  // Wallet details
  walletProvider?: string;
  walletEmail?: string;
  
  // Bank account details
  bankName?: string;
  accountLast4?: string;
  
  // UPI details
  upiId?: string;
}

export interface PaymentFilters {
  userId?: string;
  bookingId?: string;
  status?: PaymentStatus;
  method?: PaymentMethodType;
  gateway?: PaymentGateway;
  amountFrom?: number;
  amountTo?: number;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'createdAt' | 'amount' | 'status';
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

export interface PaymentStats {
  totalPayments: number;
  totalAmount: number;
  successfulPayments: number;
  failedPayments: number;
  refundedAmount: number;
  averagePayment: number;
  byMethod: { method: PaymentMethodType; count: number; amount: number }[];
  byGateway: { gateway: PaymentGateway; count: number; amount: number }[];
  byStatus: { status: PaymentStatus; count: number }[];
}

export interface PaymentIntent {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'expired';
  clientSecret?: string;
  gatewayIntentId?: string;
  expiresAt: string;
  createdAt: string;
}

export interface RefundRequest {
  paymentId: string;
  amount?: number; // If not provided, full refund
  reason: string;
  metadata?: Record<string, any>;
}

// Payment Service
export class PaymentService {
  // Payment processing
  async createPaymentIntent(data: {
    bookingId: string;
    amount: number;
    currency?: string;
    gateway: PaymentGateway;
    metadata?: Record<string, any>;
  }): Promise<ApiResponse<PaymentIntent>> {
    return paymentServiceClient.post<PaymentIntent>('/intents', data);
  }

  async processPayment(paymentRequest: PaymentRequest): Promise<ApiResponse<Payment>> {
    return paymentServiceClient.post<Payment>('/process', paymentRequest);
  }

  async confirmPayment(paymentId: string, gatewayData?: Record<string, any>): Promise<ApiResponse<Payment>> {
    return paymentServiceClient.post<Payment>(`/${paymentId}/confirm`, gatewayData);
  }

  async cancelPayment(paymentId: string, reason?: string): Promise<ApiResponse<Payment>> {
    return paymentServiceClient.patch<Payment>(`/${paymentId}/cancel`, { reason });
  }

  // Payment retrieval
  async getPaymentById(paymentId: string): Promise<ApiResponse<Payment>> {
    return paymentServiceClient.get<Payment>(`/${paymentId}`);
  }

  async getPaymentByBooking(bookingId: string): Promise<ApiResponse<Payment[]>> {
    return paymentServiceClient.get<Payment[]>(`/booking/${bookingId}`);
  }

  async getUserPayments(userId: string, filters?: Omit<PaymentFilters, 'userId'>): Promise<ApiResponse<PaginatedResponse<Payment>>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    return paymentServiceClient.get<PaginatedResponse<Payment>>(`/user/${userId}?${params.toString()}`);
  }

  async getPayments(filters?: PaymentFilters): Promise<ApiResponse<PaginatedResponse<Payment>>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    return paymentServiceClient.get<PaginatedResponse<Payment>>(`/?${params.toString()}`);
  }

  // Refund management
  async createRefund(refundRequest: RefundRequest): Promise<ApiResponse<PaymentRefund>> {
    return paymentServiceClient.post<PaymentRefund>('/refunds', refundRequest);
  }

  async getRefund(refundId: string): Promise<ApiResponse<PaymentRefund>> {
    return paymentServiceClient.get<PaymentRefund>(`/refunds/${refundId}`);
  }

  async getPaymentRefunds(paymentId: string): Promise<ApiResponse<PaymentRefund[]>> {
    return paymentServiceClient.get<PaymentRefund[]>(`/${paymentId}/refunds`);
  }

  async cancelRefund(refundId: string): Promise<ApiResponse<PaymentRefund>> {
    return paymentServiceClient.patch<PaymentRefund>(`/refunds/${refundId}/cancel`);
  }

  // Saved payment methods
  async savePaymentMethod(userId: string, paymentMethodData: {
    type: PaymentMethodType;
    provider: PaymentGateway;
    details: PaymentDetails;
    isDefault?: boolean;
  }): Promise<ApiResponse<SavedPaymentMethod>> {
    return paymentServiceClient.post<SavedPaymentMethod>('/methods', {
      userId,
      ...paymentMethodData
    });
  }

  async getUserPaymentMethods(userId: string): Promise<ApiResponse<SavedPaymentMethod[]>> {
    return paymentServiceClient.get<SavedPaymentMethod[]>(`/methods/user/${userId}`);
  }

  async updatePaymentMethod(methodId: string, updates: {
    isDefault?: boolean;
    details?: Partial<SavedPaymentDetails>;
  }): Promise<ApiResponse<SavedPaymentMethod>> {
    return paymentServiceClient.patch<SavedPaymentMethod>(`/methods/${methodId}`, updates);
  }

  async deletePaymentMethod(methodId: string): Promise<ApiResponse<void>> {
    return paymentServiceClient.delete<void>(`/methods/${methodId}`);
  }

  async setDefaultPaymentMethod(userId: string, methodId: string): Promise<ApiResponse<SavedPaymentMethod>> {
    return paymentServiceClient.patch<SavedPaymentMethod>(`/methods/${methodId}/set-default`, { userId });
  }

  // Payment verification and security
  async verifyPayment(paymentId: string, verificationData: {
    otp?: string;
    pin?: string;
    biometric?: string;
    challenge?: string;
  }): Promise<ApiResponse<Payment>> {
    return paymentServiceClient.post<Payment>(`/${paymentId}/verify`, verificationData);
  }

  async validateCard(cardDetails: {
    number: string;
    expiryMonth: number;
    expiryYear: number;
    cvv: string;
  }): Promise<ApiResponse<{
    isValid: boolean;
    brand: string;
    type: 'credit' | 'debit';
    bank?: string;
    country?: string;
  }>> {
    return paymentServiceClient.post('/validate/card', cardDetails);
  }

  async checkFraud(paymentData: {
    amount: number;
    userId: string;
    paymentMethod: PaymentMethodType;
    deviceInfo?: Record<string, any>;
  }): Promise<ApiResponse<{
    riskScore: number;
    riskLevel: 'low' | 'medium' | 'high';
    requiresVerification: boolean;
    blockedReason?: string;
  }>> {
    return paymentServiceClient.post('/fraud-check', paymentData);
  }

  // Gateway-specific operations
  async getGatewayConfig(gateway: PaymentGateway): Promise<ApiResponse<{
    publicKey: string;
    supportedMethods: PaymentMethodType[];
    fees: { method: PaymentMethodType; percentage: number; fixed: number }[];
    limits: { method: PaymentMethodType; min: number; max: number }[];
  }>> {
    return paymentServiceClient.get(`/gateways/${gateway}/config`);
  }

  async webhookHandler(gateway: PaymentGateway, payload: Record<string, any>): Promise<ApiResponse<{
    processed: boolean;
    paymentId?: string;
    status?: PaymentStatus;
  }>> {
    return paymentServiceClient.post(`/webhooks/${gateway}`, payload);
  }

  // Analytics and reporting
  async getPaymentStats(userId?: string, dateFrom?: string, dateTo?: string): Promise<ApiResponse<PaymentStats>> {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);
    return paymentServiceClient.get<PaymentStats>(`/stats?${params.toString()}`);
  }

  async getFailureAnalysis(dateFrom?: string, dateTo?: string): Promise<ApiResponse<{
    totalFailures: number;
    failureRate: number;
    topReasons: { reason: string; count: number; percentage: number }[];
    byGateway: { gateway: PaymentGateway; failures: number; rate: number }[];
    byMethod: { method: PaymentMethodType; failures: number; rate: number }[];
  }>> {
    const params = new URLSearchParams();
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);
    return paymentServiceClient.get(`/analytics/failures?${params.toString()}`);
  }

  async getRevenueReport(period: 'day' | 'week' | 'month' | 'year', dateFrom?: string, dateTo?: string): Promise<ApiResponse<{
    totalRevenue: number;
    netRevenue: number;
    fees: number;
    refunds: number;
    timeline: { date: string; revenue: number; transactions: number }[];
    breakdown: {
      byGateway: { gateway: PaymentGateway; revenue: number; percentage: number }[];
      byMethod: { method: PaymentMethodType; revenue: number; percentage: number }[];
    };
  }>> {
    const params = new URLSearchParams({ period });
    if (dateFrom) params.append('dateFrom', dateFrom);
    if (dateTo) params.append('dateTo', dateTo);
    return paymentServiceClient.get(`/analytics/revenue?${params.toString()}`);
  }

  // Disputes and chargebacks
  async getDisputes(filters?: {
    status?: 'pending' | 'won' | 'lost' | 'closed';
    dateFrom?: string;
    dateTo?: string;
  }): Promise<ApiResponse<{
    id: string;
    paymentId: string;
    amount: number;
    reason: string;
    status: string;
    evidence?: Record<string, any>;
    createdAt: string;
    resolvedAt?: string;
  }[]>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    return paymentServiceClient.get(`/disputes?${params.toString()}`);
  }

  async submitDisputeEvidence(disputeId: string, evidence: {
    receiptUrl?: string;
    shippingProof?: string;
    customerCommunication?: string;
    refundPolicy?: string;
    additionalInfo?: string;
  }): Promise<ApiResponse<void>> {
    return paymentServiceClient.post<void>(`/disputes/${disputeId}/evidence`, evidence);
  }
}

// Export singleton instance
export const paymentService = new PaymentService();
export default paymentService;