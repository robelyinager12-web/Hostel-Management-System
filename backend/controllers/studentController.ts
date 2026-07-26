import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { apiResponse } from '../utils/apiResponse';
import { prisma } from '../config/db';

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