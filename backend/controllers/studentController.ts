import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { asyncHandler } from '../utils/asyncHandler';
import { apiResponse } from '../utils/apiResponse';
import { prisma } from '../config/db';

const SALT_ROUNDS = 12;

export const getMyProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const student = await prisma.student.findUnique({
    where: { userId },
    include: {
      user: {
        select: { fullName: true, username: true, email: true, phoneNumber: true, gender: true },
      },
      room: true,
    },
  });

  if (!student) {
    throw { status: 404, message: 'Student profile not found' };
  }

  return apiResponse(res, 200, 'Profile fetched successfully', student);
});

export const getMyRoom = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const student = await prisma.student.findUnique({
    where: { userId },
    include: {
      room: {
        include: {
          students: {
            include: { user: { select: { fullName: true, email: true } } },
          },
        },
      },
    },
  });

  if (!student) {
    throw { status: 404, message: 'Student profile not found' };
  }

  if (!student.room) {
    return apiResponse(res, 200, 'No room assigned yet', null);
  }

  return apiResponse(res, 200, 'Room fetched successfully', student.room);
});

export const getAllStudents = asyncHandler(async (req: Request, res: Response) => {
  const students = await prisma.student.findMany({
    include: {
      user: { select: { fullName: true, email: true, phoneNumber: true } },
      room: { select: { roomNumber: true, block: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return apiResponse(res, 200, 'Students fetched successfully', students);
});

export const createStudent = asyncHandler(async (req: Request, res: Response) => {
  const {
    fullName,
    username,
    email,
    phoneNumber,
    gender,
    studentId,
    department,
    academicYear,
    password,
    roomId,
  } = req.body;

  if (!fullName || !username || !email || !studentId || !department || !academicYear || !password) {
    throw { status: 400, message: 'Please fill in all required fields' };
  }

  const existingEmail = await prisma.user.findUnique({ where: { email } });
  if (existingEmail) {
    throw { status: 409, message: 'Email is already registered' };
  }

  const existingUsername = await prisma.user.findUnique({ where: { username } });
  if (existingUsername) {
    throw { status: 409, message: 'Username is already taken' };
  }

  const existingStudentId = await prisma.student.findUnique({ where: { studentId } });
  if (existingStudentId) {
    throw { status: 409, message: 'This Student ID is already registered' };
  }

  if (roomId) {
    const room = await prisma.room.findUnique({ where: { id: roomId }, include: { students: true } });
    if (!room) {
      throw { status: 404, message: 'Selected room not found' };
    }
    if (room.students.length >= room.capacity) {
      throw { status: 400, message: 'Selected room is already full' };
    }
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      fullName,
      username,
      email,
      phoneNumber,
      gender: gender || undefined,
      passwordHash,
      role: 'STUDENT',
      isEmailVerified: true, // admin-created accounts skip OTP verification
    },
  });

  const student = await prisma.student.create({
    data: {
      userId: user.id,
      studentId,
      department,
      academicYear,
      roomId: roomId || undefined,
    },
  });

  if (roomId) {
    const room = await prisma.room.findUnique({ where: { id: roomId }, include: { students: true } });
    if (room && room.students.length >= room.capacity) {
      await prisma.room.update({ where: { id: roomId }, data: { status: 'OCCUPIED' } });
    }
  }

  return apiResponse(res, 201, 'Student created successfully', {
    student,
    credentials: { username, password },
  });
});