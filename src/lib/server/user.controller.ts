import type { RequestEvent } from '@sveltejs/kit';
import { error, json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const registerUser = async (event: RequestEvent): Promise<Response> => {
  const { email, password } = await event.request.json();

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw error(409, 'User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        token: '',
      },
    });

    return json({ message: 'User registered successfully', user: newUser }, { status: 201 });
  } catch (err: any) {
    throw error(500, 'Error registering user');
  }
};

export const loginUser = async (event: RequestEvent): Promise<Response> => {
  const { email, password } = await event.request.json();

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw error(401, 'Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw error(401, 'Invalid credentials');
    }

    const token = jwt.sign({ userId: user.id }, 'manug9704');

    await prisma.user.update({
      where: { id: user.id },
      data: { token },
    });

    event.cookies.set('token', token, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return json({ message: 'Login successful', email, userId: user.id });
  } catch (err: any) {
    throw error(500, 'Error logging in');
  }
};

export const logoutUser = async (event: RequestEvent): Promise<Response> => {
  const userId = event.locals.userId;

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { token: '' },
    });

    event.cookies.delete('token', { path: '/' });
    return json({ message: 'Logout successful' });
  } catch (err: any) {
    throw error(500, 'Error logging out');
  }
};