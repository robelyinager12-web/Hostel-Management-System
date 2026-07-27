import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { apiResponse } from '../utils/apiResponse';
import * as authService from '../services/authService';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.registerUser(req.body);
  return apiResponse(res, 201, 'Registration successful. Check your email for the OTP code.', {
    userId: user.id,
    email: user.email,
  });
});

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  await authService.verifyOtp(email, otp);
  return apiResponse(res, 200, 'Email verified successfully. You can now log in.');
});

export const resendOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  const otp = await authService.resendOtp(email);

  if (process.env.NODE_ENV !== 'production') {
    return apiResponse(res, 200, 'A new OTP has been generated', { otp });
  }
  return apiResponse(res, 200, 'A new OTP has been sent to your email');
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { username, password, rememberMe } = req.body;
  const { user, accessToken, refreshToken } = await authService.loginUser(
    username,
    password,
    req.ip,
    req.headers['user-agent'],
  );

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
  });

  return apiResponse(res, 200, 'Login successful', { user, accessToken });
});

export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw { status: 400, message: 'Current and new password are required' };
  }
  if (newPassword.length < 8) {
    throw { status: 400, message: 'New password must be at least 8 characters' };
  }

  await authService.changePassword(userId, currentPassword, newPassword);
  return apiResponse(res, 200, 'Password changed successfully');
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const token = req.cookies?.refreshToken;
  const { accessToken } = await authService.refreshAccessToken(token);
  return apiResponse(res, 200, 'Token refreshed', { accessToken });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  await authService.logoutUser(req.cookies?.refreshToken);
  res.clearCookie('refreshToken');
  return apiResponse(res, 200, 'Logged out successfully');
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  return apiResponse(res, 200, 'Current user', { user: req.user });
});