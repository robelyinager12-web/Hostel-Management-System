import { apiClient } from '@/lib/api-client';

interface RegisterPayload {
  fullName: string;
  username: string;
  studentId: string;
  email: string;
  phoneNumber: string;
  gender: string;
  department: string;
  academicYear: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface LoginPayload {
  username: string;
  password: string;
  rememberMe?: boolean;
}

interface AuthUser {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: string;
}

export const authService = {
  register: (payload: RegisterPayload) =>
    apiClient.post<{ success: boolean; message: string; data: { userId: string; email: string } }>(
      '/auth/register',
      payload,
    ),

  verifyOtp: (email: string, otp: string) =>
    apiClient.post<{ success: boolean; message: string }>('/auth/verify-otp', { email, otp }),

  resendOtp: (email: string) =>
    apiClient.post<{ success: boolean; message: string; data?: { otp?: string } }>(
      '/auth/resend-otp',
      { email },
    ),

  login: (payload: LoginPayload) =>
    apiClient.post<{
      success: boolean;
      message: string;
      data: { user: AuthUser; accessToken: string };
    }>('/auth/login', payload),

  logout: () => apiClient.post('/auth/logout'),

  getCurrentUser: () =>
    apiClient.get<{ success: boolean; data: { user: AuthUser } }>('/auth/me'),
};