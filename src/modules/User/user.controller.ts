import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { createError } from '../../../Utils/middleware/error';
import { User } from './user.model';

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['user', 'admin']),
  password: z.string().min(6),
  phone: z.string(),
  address: z.string(),
});

const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = userSchema.parse(req.body);
    const user = new User(parsed);
    await user.save();
    res.status(201).json({ success: true, statusCode: 201, message: 'User registered successfully', data: user });
  } catch (error) {
    next(createError(400, 'Failed to register user', [{ path: 'User', message: (error as Error).message }]));
  }
};

export const signin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = signinSchema.parse(req.body);
    const user = await User.findOne({ email: parsed.email });
    if (!user || !(await user.comparePassword(parsed.password))) {
      // return res.status(401).send("User Unauthorised");
      res.status(401).send({ success: false, statusCode: 401, message: 'Unauthorized user'});
      return;
    }
    const token = jwt.sign({ id: user._id, role: user.role }, 'secretKey', { expiresIn: '1h' });
    res.status(200).json({ success: true, statusCode: 200, message: 'User logged in successfully', data: user, token });
  } catch (error) {
    res.status(500).json({ success: false, statusCode: 500, message: 'Failed to login user', details: (error as Error).message });
  }
};
