import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { apiResponse } from '../utils/apiResponse';
import { prisma } from '../config/db';

export const getMyFees = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const student = await prisma.student.findUnique({ where: { userId } });
  if (!student) {
    throw { status: 404, message: 'Student profile not found' };
  }

  const fees = await prisma.fee.findMany({
    where: { studentId: student.id },
    orderBy: { dueDate: 'desc' },
  });

  const summary = {
    totalDue: fees
      .filter((f) => f.status === 'PENDING' || f.status === 'PARTIAL' || f.status === 'OVERDUE')
      .reduce((sum, f) => sum + Number(f.amount), 0),
    totalPaid: fees
      .filter((f) => f.status === 'PAID')
      .reduce((sum, f) => sum + Number(f.amount), 0),
  };

  return apiResponse(res, 200, 'Fees fetched successfully', { fees, summary });
});

export const getAllFees = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.query;

  const fees = await prisma.fee.findMany({
    where: status ? { status: status as any } : undefined,
    include: {
      student: {
        include: { user: { select: { fullName: true, email: true } } },
      },
    },
    orderBy: { dueDate: 'asc' },
  });

  return apiResponse(res, 200, 'Fees fetched successfully', fees);
});

export const createFee = asyncHandler(async (req: Request, res: Response) => {
  const { studentId, amount, dueDate, semester } = req.body;

  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) {
    throw { status: 404, message: 'Student not found' };
  }

  const fee = await prisma.fee.create({
    data: { studentId, amount, dueDate: new Date(dueDate), semester },
  });

  return apiResponse(res, 201, 'Fee record created successfully', fee);
});

export const markFeePaid = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const fee = await prisma.fee.findUnique({ where: { id } });
  if (!fee) {
    throw { status: 404, message: 'Fee record not found' };
  }

  const updated = await prisma.fee.update({
    where: { id },
    data: { status: 'PAID', paidDate: new Date() },
  });

  return apiResponse(res, 200, 'Fee marked as paid', updated);
});