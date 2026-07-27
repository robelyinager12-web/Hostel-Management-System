import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { apiResponse } from '../utils/apiResponse';
import * as assistantEngine from '../services/ai/assistantEngine';

export const chat = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { message, history } = req.body;

  if (!message || typeof message !== 'string') {
    throw { status: 400, message: 'A message is required' };
  }

  const reply = await assistantEngine.chatWithAssistant(userId, message, history || []);
  return apiResponse(res, 200, 'Assistant responded', { reply });
});