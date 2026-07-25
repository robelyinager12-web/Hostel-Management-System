import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import * as tokenService from './tokenService';
import * as otpService from './otpService';
import * as emailService from './emailService';

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

interface RegisterInput {
  fullName: string;
  username: string;
  studentId: string;
  email: string;
  phoneNumber: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  department: string;
  academicYear: string;
  password: string;
}

export async function registerUser(input: RegisterInput) {
  const existingEmail = await prisma.user.findUnique({ where: { email: input.email } });
  if (existingEmail) {
    throw { status: 409, message: 'Email is already registered' };
  }

  const existingUsername = await prisma.user.findUnique({ where: { username: input.username } });
  if (existingUsername) {
    throw { status: 409, message: 'Username is already taken' };
  }

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const otp = otpService.generateOtp();

  const user = await prisma.user.create({
    data: {
      fullName: input.fullName,
      username: input.username,
      email: input.email,
      phoneNumber: input.phoneNumber,
      gender: input.gender,
      passwordHash,
      role: 'STUDENT',
      otpCode: otp,
      otpExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
  });

  await prisma.student.create({
    data: {
      userId: user.id,
      studentId: input.studentId,
      department: input.department,
      academicYear: input.academicYear,
    },
  });

  await emailService.sendOtpEmail(user.email, otp);

  return user;
}

export async function verifyOtp(email: string, otp: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.otpCode || !user.otpExpiresAt) {
    throw { status: 400, message: 'Invalid verification request' };
  }
  if (user.otpCode !== otp) {
    throw { status: 400, message: 'Incorrect OTP code' };
  }
  if (user.otpExpiresAt < new Date()) {
    throw { status: 400, message: 'OTP code has expired' };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { isEmailVerified: true, otpCode: null, otpExpiresAt: null },
  });
}

export async function loginUser(
  username: string,
  password: string,
  ipAddress?: string,
  userAgent?: string,
) {
  const user = await prisma.user.findUnique({ where: { username } });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    if (user) {
      await prisma.loginActivity.create({
        data: { userId: user.id, ipAddress, userAgent, success: false },
      });
    }
    throw { status: 401, message: 'Invalid username or password' };
  }

  if (!user.isEmailVerified) {
    throw { status: 403, message: 'Please verify your email before logging in' };
  }

  const accessToken = tokenService.signAccessToken({ userId: user.id, role: user.role });
  const refreshToken = tokenService.signRefreshToken({ userId: user.id });

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken, lastLoginAt: new Date() },
  });

  await prisma.loginActivity.create({
    data: { userId: user.id, ipAddress, userAgent, success: true },
  });

  const { passwordHash, otpCode, refreshToken: _rt, ...safeUser } = user;

  return { user: safeUser, accessToken, refreshToken };
}

export async function refreshAccessToken(token?: string) {
  if (!token) {
    throw { status: 401, message: 'No refresh token provided' };
  }

  const payload = tokenService.verifyRefreshToken(token);
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });

  if (!user || user.refreshToken !== token) {
    throw { status: 401, message: 'Invalid refresh token' };
  }

  const accessToken = tokenService.signAccessToken({ userId: user.id, role: user.role });
  return { accessToken };
}

export async function logoutUser(token?: string) {
  if (!token) return;
  const payload = tokenService.decodeToken(token);
  if (payload?.userId) {
    await prisma.user.update({
      where: { id: payload.userId },
      data: { refreshToken: null },
    });
  }
}