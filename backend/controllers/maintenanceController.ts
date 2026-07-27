import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { apiResponse } from '../utils/apiResponse';
import { prisma } from '../config/db';

export const createMaintenanceRequest = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { roomId, issue } = req.body;

  const room = await prisma.room.findUnique({ where: { id: roomId } });
  if (!room) {
    throw { status: 404, message: 'Room not found' };
  }

  const request = await prisma.maintenanceRequest.create({
    data: { raisedById: userId, roomId, issue },
  });

  return apiResponse(res, 201, 'Maintenance request submitted successfully', request);
});

export const getAllMaintenanceRequests = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.query;

  const requests = await prisma.maintenanceRequest.findMany({
    where: status ? { status: status as any } : undefined,
    include: {
      raisedBy: { select: { fullName: true, role: true } },
      room: { select: { roomNumber: true, block: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return apiResponse(res, 200, 'Maintenance requests fetched successfully', requests);
});

export const updateMaintenanceStatus = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { status } = req.body;

  const request = await prisma.maintenanceRequest.findUnique({ where: { id } });
  if (!request) {
    throw { status: 404, message: 'Maintenance request not found' };
  }

  const updated = await prisma.maintenanceRequest.update({ where: { id }, data: { status } });
  return apiResponse(res, 200, 'Maintenance request status updated', updated);
});