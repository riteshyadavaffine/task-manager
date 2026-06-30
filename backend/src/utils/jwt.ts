import jwt from 'jsonwebtoken';

export interface JWTPayload {
  userId: string;
  email: string;
}

export function generateToken(payload: JWTPayload): string {
  const secret = process.env.JWT_SECRET || 'default-secret-key';
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const secret = process.env.JWT_SECRET || 'default-secret-key';
    return jwt.verify(token, secret) as JWTPayload;
  } catch {
    return null;
  }
}

