import jwt from 'jsonwebtoken';
import { Response, Request, NextFunction } from 'express';

export default function auth(req: Request, res: Response, next: NextFunction) {
  const header = req.header('Authorization');
  if (!header) {
    return res.status(401).send('Access Denied');
  }

  const token = header.split('Bearer ')[1];

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET || '');
    req.user = verified;

    next();
  } catch (err) {
    return res.status(400).send('Invalid token');
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
