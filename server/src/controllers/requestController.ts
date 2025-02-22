import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createRequestSchema = z.object({
  topic: z.string().min(1, 'Необходимо заполнить тему обращения'),
  message: z.string().min(1, 'Необходимо заполнить текст обращения'),
});

export const createRequest = async (data: any) => {
  const parsedData = createRequestSchema.parse(data);

  return await prisma.request.create({
    data: {
      topic: parsedData.topic,
      message: parsedData.message,
    },
  });
};

export const startRequest = async (id: string) => {
  const existingRequest = await prisma.request.findUnique({ where: { id } });

  if (!existingRequest) {
    throw new Error('Обращение не найдено в базе данных');
  }
  if (existingRequest.status !== 'NEW') {
    throw new Error(
      'Только обращения со статусом "НОВОЕ" можно взять в работу'
    );
  }

  const updatedRequest = await prisma.request.update({
    where: { id },
    data: { status: 'IN_PROGRESS' },
  });

  return updatedRequest;
};

const completeRequestSchema = z.object({
  resolution: z
    .string()
    .optional()
    .default('Обращение обработано без дополнительных комментариев'),
});

export const completeRequest = async (id: string, body: any) => {
  const parsedData = completeRequestSchema.parse(body);

  const resolution =
    parsedData.resolution?.trim().length === 0
      ? 'Обращение обработано без дополнительных комментариев'
      : parsedData.resolution;

  const existingRequest = await prisma.request.findUnique({ where: { id } });

  if (!existingRequest) {
    throw new Error('Обращение не найдено в базе данных');
  }
  if (existingRequest.status !== 'IN_PROGRESS') {
    throw new Error(
      'Только для обращения со статусом "В РАБОТЕ" можно завершить обработку'
    );
  }

  const updatedRequest = await prisma.request.update({
    where: { id },
    data: { status: 'COMPLETED', resolution },
  });

  return updatedRequest;
};

const cancelRequestSchema = z.object({
  cancelNote: z
    .string()
    .optional()
    .default('Обращение отменено без дополнительных комментариев'),
});

export const cancelRequest = async (id: string, body: any) => {
  const parsedData = cancelRequestSchema.parse(body);
  const cancelNote =
    parsedData.cancelNote?.trim().length === 0
      ? 'Обращение отменено без дополнительных комментариев'
      : parsedData.cancelNote;

  const existingRequest = await prisma.request.findUnique({ where: { id } });

  if (!existingRequest) {
    throw new Error('Обращение не найдено в базе данных');
  }
  if (
    existingRequest.status === 'COMPLETED' ||
    existingRequest.status === 'CANCELED'
  ) {
    throw new Error(
      'Нельзя отменить обращение со статусом "ЗАВЕРШЕНО" или "ОТМЕНЕНО"'
    );
  }

  const updatedRequest = await prisma.request.update({
    where: { id },
    data: { status: 'CANCELED', cancelNote },
  });

  return updatedRequest;
};

export const getRequests = async (query: any) => {
  let whereConfig: any = {};

  if (query.date) {
    const date = new Date(query.date);
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    whereConfig = { createdAt: { gte: startOfDay, lte: endOfDay } };
  } else if (query.startDate && query.endDate) {
    const startDate = new Date(query.startDate);
    const endDate = new Date(query.endDate);
    endDate.setHours(23, 59, 59, 999);
    whereConfig = { createdAt: { gte: startDate, lte: endDate } };
  }

  if (query.status) {
    whereConfig.status = query.status;
  }

  const requests = await prisma.request.findMany({ where: whereConfig });

  return requests;
};

const cancelAllRequestsSchema = z.object({
  cancelNote: z
    .string()
    .optional()
    .default('Обращение отменено без дополнительных комментариев'),
});

export const cancelAllRequestsInProgress = async (body: any) => {
  const parsedData = cancelAllRequestsSchema.parse(body);
  const cancelNote =
    parsedData.cancelNote?.trim().length === 0
      ? 'Обращение отменено без дополнительных комментариев'
      : parsedData.cancelNote;

  const result = await prisma.request.updateMany({
    where: { status: 'IN_PROGRESS' },
    data: { status: 'CANCELED', cancelNote },
  });

  return result;
};

export const getRequestById = async (id: string) => {
  const existingRequest = await prisma.request.findUnique({ where: { id } });

  if (!existingRequest) {
    throw new Error('Обращение не найдено в базе данных');
  }

  return existingRequest;
};
