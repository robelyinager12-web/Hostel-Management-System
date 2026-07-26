import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { apiResponse } from '../utils/apiResponse';
import { prisma } from '../config/db';

export const createComplaint = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { title, description, category } = req.body;

  const complaint = await prisma.complaint.create({
    data: { raisedById: userId, title, description, category },
  });

  return apiResponse(res, 201, 'Complaint submitted successfully', complaint);
});

export const getMyComplaints = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;

  const complaints = await prisma.complaint.findMany({
    where: { raisedById: userId },
    orderBy: { createdAt: 'desc' },
  });

  return apiResponse(res, 200, 'Complaints fetched successfully', complaints);
});

export const getAllComplaints = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.query;

  const complaints = await prisma.complaint.findMany({
    where: status ? { status: status as any } : undefined,
    include: {
      raisedBy: { select: { fullName: true, email: true, role: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return apiResponse(res, 200, 'Complaints fetched successfully', complaints);
});

export const updateComplaintStatus = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { status } = req.body;

  const complaint = await prisma.complaint.findUnique({ where: { id } });
  if (!complaint) {
    throw { status: 404, message: 'Complaint not found' };
  }

  const updated = await prisma.complaint.update({ where: { id }, data: { status } });
  return apiResponse(res, 200, 'Complaint status updated', updated);
});