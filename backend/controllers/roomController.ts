import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { apiResponse } from '../utils/apiResponse';
import { prisma } from '../config/db';

export const createRoom = asyncHandler(async (req: Request, res: Response) => {
  const { roomNumber, block, floor, capacity, amenities } = req.body;

  const existing = await prisma.room.findUnique({ where: { roomNumber } });
  if (existing) {
    throw { status: 409, message: 'A room with this number already exists' };
  }

  const room = await prisma.room.create({
    data: { roomNumber, block, floor, capacity, amenities: amenities || [] },
  });

  return apiResponse(res, 201, 'Room created successfully', room);
});

export const getRooms = asyncHandler(async (req: Request, res: Response) => {
  const { status, block } = req.query;

  const rooms = await prisma.room.findMany({
    where: {
      ...(status ? { status: status as any } : {}),
      ...(block ? { block: block as string } : {}),
    },
    include: {
      students: {
        include: { user: { select: { fullName: true, email: true } } },
      },
    },
    orderBy: [{ block: 'asc' }, { roomNumber: 'asc' }],
  });

  const withOccupancy = rooms.map((room) => ({
    ...room,
    occupancy: room.students.length,
    isFull: room.students.length >= room.capacity,
  }));

  return apiResponse(res, 200, 'Rooms fetched successfully', withOccupancy);
});

export const getRoomById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const room = await prisma.room.findUnique({
    where: { id },
    include: {
      students: { include: { user: { select: { fullName: true, email: true } } } },
      maintenance: true,
    },
  });

  if (!room) {
    throw { status: 404, message: 'Room not found' };
  }

  return apiResponse(res, 200, 'Room fetched successfully', room);
});

export const updateRoom = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { block, floor, capacity, amenities, status } = req.body;

  const room = await prisma.room.update({
    where: { id },
    data: { block, floor, capacity, amenities, status },
  });

  return apiResponse(res, 200, 'Room updated successfully', room);
});

export const deleteRoom = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const room = await prisma.room.findUnique({
    where: { id },
    include: { students: true },
  });

  if (!room) {
    throw { status: 404, message: 'Room not found' };
  }
  if (room.students.length > 0) {
    throw { status: 400, message: 'Cannot delete a room that has students assigned' };
  }

  await prisma.room.delete({ where: { id } });
  return apiResponse(res, 200, 'Room deleted successfully');
});

export const getRoomStats = asyncHandler(async (req: Request, res: Response) => {
  const [total, available, occupied, maintenance] = await Promise.all([
    prisma.room.count(),
    prisma.room.count({ where: { status: 'AVAILABLE' } }),
    prisma.room.count({ where: { status: 'OCCUPIED' } }),
    prisma.room.count({ where: { status: 'MAINTENANCE' } }),
  ]);

  return apiResponse(res, 200, 'Room stats fetched successfully', {
    total,
    available,
    occupied,
    maintenance,
  });
});