import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { apiResponse } from '../utils/apiResponse';
import { prisma } from '../config/db';

export const checkInVisitor = asyncHandler(async (req: Request, res: Response) => {
  const { studentId, visitorName, visitorPhone, purpose } = req.body;

  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) {
    throw { status: 404, message: 'Student not found' };
  }

  const visitor = await prisma.visitor.create({
    data: { studentId, visitorName, visitorPhone, purpose },
  });

  return apiResponse(res, 201, 'Visitor checked in successfully', visitor);
});

export const checkOutVisitor = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const visitor = await prisma.visitor.findUnique({ where: { id } });
  if (!visitor) {
    throw { status: 404, message: 'Visitor record not found' };
  }
  if (visitor.checkOutAt) {
    throw { status: 400, message: 'Visitor has already checked out' };
  }

  const updated = await prisma.visitor.update({
    where: { id },
    data: { checkOutAt: new Date() },
  });

  return apiResponse(res, 200, 'Visitor checked out successfully', updated);
});

export const getAllVisitors = asyncHandler(async (req: Request, res: Response) => {
  const { activeOnly } = req.query;

  const visitors = await prisma.visitor.findMany({
    where: activeOnly === 'true' ? { checkOutAt: null } : undefined,
    include: {
      student: {
        include: { user: { select: { fullName: true } } },
      },
    },
    orderBy: { checkInAt: 'desc' },
    take: 100,
  });

  return apiResponse(res, 200, 'Visitors fetched successfully', visitors);
});