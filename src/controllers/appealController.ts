import { Request, Response } from 'express';
import Appeal, { AppealStatus } from '../models/Appeal';

export const createAppeal = async (req: Request, res: Response) => {
  const { subject, text } = req.body;
  if (!subject || !text) {
    res.status(400).json({ message: 'Subject and text are required' });
    return;
  }

  const appeal = new Appeal({ subject, text });
  await appeal.save();
  res.status(201).json(appeal); // Без return
};

export const takeAppealInProgress = async (req: Request, res: Response) => {
  const { id } = req.params;
  const appeal = await Appeal.findById(id);

  if (!appeal || appeal.status !== AppealStatus.New) {
    res.status(400).json({ message: 'Appeal not found or not in New status' });
    return;
  }

  appeal.status = AppealStatus.InProgress;
  appeal.updatedAt = new Date();
  await appeal.save();
  res.json(appeal); // Без return
};

export const completeAppeal = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { resolution } = req.body;

  if (!resolution) {
    res.status(400).json({ message: 'Resolution is required' });
    return;
  }

  const appeal = await Appeal.findById(id);
  if (!appeal || appeal.status !== AppealStatus.InProgress) {
    res.status(400).json({ message: 'Appeal not found or not in InProgress status' });
    return;
  }

  appeal.status = AppealStatus.Completed;
  appeal.resolution = resolution;
  appeal.updatedAt = new Date();
  await appeal.save();
  res.json(appeal); // Без return
};

export const cancelAppeal = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { cancelReason } = req.body;

  if (!cancelReason) {
    res.status(400).json({ message: 'Cancel reason is required' });
    return;
  }

  const appeal = await Appeal.findById(id);
  if (!appeal || appeal.status === AppealStatus.Completed || appeal.status === AppealStatus.Cancelled) {
    res.status(400).json({ message: 'Appeal not found or cannot be cancelled' });
    return;
  }

  appeal.status = AppealStatus.Cancelled;
  appeal.cancelReason = cancelReason;
  appeal.updatedAt = new Date();
  await appeal.save();
  res.json(appeal); // Без return
};

export const getAppeals = async (req: Request, res: Response) => {
  const { date, startDate, endDate } = req.query;

  const filter: any = {};
  if (date) {
    filter.createdAt = {
      $gte: new Date(date as string),
      $lte: new Date(date as string),
    };
  } else if (startDate && endDate) {
    filter.createdAt = {
      $gte: new Date(startDate as string),
      $lte: new Date(endDate as string),
    };
  }

  const appeals = await Appeal.find(filter);
  res.json(appeals); // Без return
};

export const cancelAllInProgress = async (req: Request, res: Response) => {
  const result = await Appeal.updateMany(
    { status: AppealStatus.InProgress },
    { status: AppealStatus.Cancelled, cancelReason: 'Mass cancellation', updatedAt: new Date() }
  );
  res.json({ message: `Cancelled ${result.modifiedCount} appeals` }); // Без return
};