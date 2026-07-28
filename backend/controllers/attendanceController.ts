import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { apiResponse } from '../utils/apiResponse';
import { prisma } from '../config/db';

export const markAttendance = asyncHandler(async (req: Request, res: Response) => {
  const { date, records } = req.body as {
    date: string;
    records: Array<{ studentId: string; present: boolean }>;
  };

  if (!date || !Array.isArray(records) || records.length === 0) {
    throw { status: 400, message: 'A date and at least one attendance record are required' };
  }

  const attendanceDate = new Date(date);

  const results = await Promise.all(
    records.map((record) =>
      prisma.attendance.upsert({
        where: {
          studentId_date: { studentId: record.studentId, date: attendanceDate },
        },
        update: { present: record.present },
        create: {
          studentId: record.studentId,
          date: attendanceDate,
          present: record.present,
        },
      }),
    ),
  );

  return apiResponse(res, 200, 'Attendance recorded successfully', results);
});

export const getAttendanceByDate = asyncHandler(async (req: Request, res: Response) => {
  const { date } = req.query;
  const targetDate = date ? new Date(date as string) : new Date();

  const students = await prisma.student.findMany({
    include: {
      user: { select: { fullName: true } },
      room: { select: { roomNumber: true, block: true } },
    },
    orderBy: { studentId: 'asc' },
  });

  const attendanceRecords = await prisma.attendance.findMany({
    where: { date: targetDate },
  });

  const attendanceMap = new Map(attendanceRecords.map((a) => [a.studentId, a.present]));

  const combined = students.map((student) => ({
    studentId: student.id,
    studentCode: student.studentId,
    fullName: student.user.fullName,
    room: student.room ? `${student.room.roomNumber} (${student.room.block})` : 'Unassigned',
    present: attendanceMap.has(student.id) ? attendanceMap.get(student.id) : null,
  }));

  return apiResponse(res, 200, 'Attendance fetched successfully', combined);
});

export const getMyAttendance = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const student = await prisma.student.findUnique({ where: { userId } });
  if (!student) {
    throw { status: 404, message: 'Student profile not found' };
  }

  const records = await prisma.attendance.findMany({
    where: { studentId: student.id },
    orderBy: { date: 'desc' },
    take: 60,
  });

  return apiResponse(res, 200, 'Attendance history fetched successfully', records);
});