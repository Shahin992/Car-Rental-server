import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'You have no access to this route' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, 'secretKey') as { userId: string, role: string };
    (req as any).user = decoded;
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error);
    res.status(401).json({ success: false, message: 'You have no access to this route' });
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!(req as any).user || !roles.includes((req as any).user.role)) {
      return res.status(403).json({ success: false, message: 'You are not authorized to access this route' });
    }
    next();
  };
};
