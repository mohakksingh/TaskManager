import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import prisma from '../utils/prisma';
import { createTaskSchema, updateTaskSchema } from '../utils/validation';

// Get Tasks with Pagination, Filtering, Searching
export const getTasks = async (req: AuthRequest, res: Response) => {
  const userId = req.user!.userId;
  const { page = '1', limit = '10', status, search } = req.query;

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  const where: any = { userId };

  if (status) {
    where.status = status;
  }

  if (search) {
    where.title = { contains: search as string }; // Removed mode: 'insensitive' for SQLite compatibility if needed, but Prisma works.
  }

  try {
    const tasks = await prisma.task.findMany({
      where,
      skip,
      take: limitNum,
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.task.count({ where });

    res.json({
      tasks,
      pagination: {
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description } = createTaskSchema.parse(req.body);
    const userId = req.user!.userId;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        userId,
      },
    });

    res.status(201).json(task);
  } catch (error: any) {
    if (error.errors) {
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: error.errors.map((e: any) => e.message) 
      });
    }
    console.error('Create Task Error:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

export const getTaskById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.userId;

  try {
    const task = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) return res.status(404).json({ error: 'Task not found' });

    res.json(task);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch task' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.userId;

  try {
    const data = updateTaskSchema.parse(req.body);

    // Verify ownership
    const task = await prisma.task.findFirst({ where: { id, userId } });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const updatedTask = await prisma.task.update({
      where: { id },
      data,
    });

    res.json(updatedTask);
  } catch (error: any) {
    if (error.errors) {
        return res.status(400).json({ 
          error: 'Validation failed', 
          details: error.errors.map((e: any) => e.message) 
        });
    }
    console.error('Update Task Error:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.userId;

  try {
    const task = await prisma.task.findFirst({ where: { id, userId } });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    await prisma.task.delete({ where: { id } });
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

export const toggleTaskStatus = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user!.userId;

  try {
    const task = await prisma.task.findFirst({ where: { id, userId } });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    const newStatus = task.status === 'OPEN' ? 'DONE' : 'OPEN';
    const updatedTask = await prisma.task.update({
      where: { id },
      data: { status: newStatus },
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle task status' });
  }
};
