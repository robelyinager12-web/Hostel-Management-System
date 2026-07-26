import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { apiResponse } from '../utils/apiResponse';
import { prisma } from '../config/db';

export const createAnnouncement = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { title, message } = req.body;

  const announcement = await prisma.announcement.create({
    data: { authorId: userId, title, message },
  });

  return apiResponse(res, 201, 'Announcement posted successfully', announcement);
});

export const getAnnouncements = asyncHandler(async (req: Request, res: Response) => {
  const announcements = await prisma.announcement.findMany({
    include: {
      author: { select: { fullName: true, role: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return apiResponse(res, 200, 'Announcements fetched successfully', announcements);
});

export const deleteAnnouncement = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const announcement = await prisma.announcement.findUnique({ where: { id } });
  if (!announcement) {
    throw { status: 404, message: 'Announcement not found' };
  }

  await prisma.announcement.delete({ where: { id } });
  return apiResponse(res, 200, 'Announcement deleted successfully');
});