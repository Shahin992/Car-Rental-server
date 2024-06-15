import { Schema, model, Document } from 'mongoose';
import { ICar } from './cars.interface';


const carSchema = new Schema<ICar>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  color: { type: String, required: true },
  isElectric: { type: Boolean, required: true },
  status: { type: String, enum: ['available', 'unavailable'], default: 'available' },
  features: { type: [String], required: true },
  pricePerHour: { type: Number, required: true },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true ,versionKey: false});

export const Car = model<ICar>('Car', carSchema);
