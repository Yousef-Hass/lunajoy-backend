import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { DailyLog } from '../entities/DailyLog';
import { Between } from 'typeorm';

const dailyLogRepository = AppDataSource.getRepository(DailyLog);

export async function createDailyLog(req: Request, res: Response) {
  try {
    const {
      mood,
      anxietyLevel,
      sleepHours,
      sleepQuality,
      sleepDisturbances,
      physicalActivityType,
      physicalActivityDuration,
      socialInteractions,
      stressLevel,
      depressionSymptoms,
      anxietySymptoms,
    } = req.body;
    const userId = (req as any).user.userId;

    const dailyLog = dailyLogRepository.create({
      user: { id: userId },
      mood,
      anxietyLevel,
      sleepHours,
      sleepQuality,
      sleepDisturbances,
      physicalActivityType,
      physicalActivityDuration,
      socialInteractions,
      stressLevel,
      depressionSymptoms,
      anxietySymptoms,
    });

    await dailyLogRepository.save(dailyLog);
    // Emit event to all clients
    const io = req.app.get('io');
    io.emit('new-daily-log', dailyLog);
    res.status(201).json(dailyLog);
  } catch (error) {
    console.error('Create daily log error:', error);
    res.status(500).json({ error: 'Failed to create daily log' });
  }
}

export async function getDailyLogs(req: Request, res: Response) {
  try {
    const userId = (req as any).user.userId;
    const { startDate, endDate } = req.query;

    const where: any = { userId };

    if (startDate && endDate) {
      where.createdAt = Between(new Date(startDate as string), new Date(endDate as string));
    }

    const dailyLogs = await dailyLogRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });

    res.json(dailyLogs);
  } catch (error) {
    console.error('Get daily logs error:', error);
    res.status(500).json({ error: 'Failed to fetch daily logs' });
  }
}
