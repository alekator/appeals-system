import { Schema, model, Document } from 'mongoose';

// Экспортируем перечисление AppealStatus
export enum AppealStatus {
  New = 'New',
  InProgress = 'InProgress',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
}

interface IAppeal extends Document {
  subject: string;
  text: string;
  status: AppealStatus;
  resolution?: string;
  cancelReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const appealSchema = new Schema<IAppeal>({
  subject: { type: String, required: true },
  text: { type: String, required: true },
  status: {
    type: String,
    enum: Object.values(AppealStatus),
    default: AppealStatus.New,
  },
  resolution: { type: String },
  cancelReason: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Экспортируем модель как default
export default model<IAppeal>('Appeal', appealSchema);