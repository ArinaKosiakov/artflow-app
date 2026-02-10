import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { AppError } from '../types';

const SALT_ROUNDS = 10;

export class AuthService {
  /**
   * Register a new user: hash password, create User and default UserSettings.
   */
  async register(name: string, email: string, password: string) {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new AppError(409, 'Email already registered');
    }
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        name: name.trim() || null,
        email: email.trim().toLowerCase(),
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        profilePicture: true,
        createdAt: true,
      },
    });
    await prisma.userSettings.create({
      data: {
        userId: user.id,
        darkMode: false,
        language: 'en',
      },
    });
    const token = this.signToken(user.id, user.email, user.name ?? undefined);
    return { user, token };
  }

  /**
   * Login: verify credentials and return user + JWT.
   */
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
    if (!user) {
      throw new AppError(401, 'Invalid email or password');
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new AppError(401, 'Invalid email or password');
    }
    const token = this.signToken(user.id, user.email, user.name ?? undefined);
    const { password: _p, ...safeUser } = user;
    return { user: safeUser, token };
  }

  /**
   * Get current user by id (for GET /api/auth/me).
   */
  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        profilePicture: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      throw new AppError(404, 'User not found');
    }
    return user;
  }

  private signToken(id: string, email: string, name?: string): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new AppError(500, 'Server configuration error: JWT_SECRET missing');
    }
    return jwt.sign(
      { id, email, name },
      secret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }
}
