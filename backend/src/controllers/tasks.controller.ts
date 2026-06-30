import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { AppError } from '../middleware/errorHandler.js';
import { CreateTaskRequest, UpdateTaskRequest } from '../types/index.js';

const prisma = new PrismaClient();

export async function getTasks(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const status = req.query.status as string | undefined;

    const where: any = { userId: req.user.userId };
    if (status) {
      where.status = status;
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: tasks,
    });
  } catch (err) {
    next(err);
  }
}

export async function getTaskById(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new AppError(404, 'Task not found');
    }

    if (task.userId !== req.user.userId) {
      throw new AppError(403, 'Forbidden - you do not own this task');
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (err) {
    next(err);
  }
}

export async function createTask(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const { title, description } = req.body as CreateTaskRequest;

    if (!title) {
      throw new AppError(400, 'Title is required');
    }

    const task = await prisma.task.create({
      data: {
        userId: req.user.userId,
        title,
        description: description || null,
        status: 'ACTIVE',
      },
    });

    res.status(201).json({
      success: true,
      data: task,
      message: 'Task created successfully',
    });
  } catch (err) {
    next(err);
  }
}

export async function updateTask(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const { id } = req.params;
    const { title, description, status } = req.body as UpdateTaskRequest;

    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new AppError(404, 'Task not found');
    }

    if (task.userId !== req.user.userId) {
      throw new AppError(403, 'Forbidden - you do not own this task');
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title: title || task.title,
        description: description !== undefined ? description : task.description,
        status: status || task.status,
      },
    });

    res.status(200).json({
      success: true,
      data: updatedTask,
      message: 'Task updated successfully',
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user) {
      throw new AppError(401, 'Unauthorized');
    }

    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new AppError(404, 'Task not found');
    }

    if (task.userId !== req.user.userId) {
      throw new AppError(403, 'Forbidden - you do not own this task');
    }

    await prisma.task.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (err) {
    next(err);
  }
}

