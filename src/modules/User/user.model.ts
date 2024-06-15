import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from './user.interface';



const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['user', 'admin'], required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true }
}, { timestamps: true ,versionKey:false});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = model<IUser>('User', userSchema);
