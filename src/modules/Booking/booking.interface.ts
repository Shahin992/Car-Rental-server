import { Schema } from 'mongoose';

export interface IBooking extends Document {
  date: Date;
  user: Schema.Types.ObjectId;
  car: Schema.Types.ObjectId;
  startTime: string;
  endTime: string | null;
  totalCost: number;
}
