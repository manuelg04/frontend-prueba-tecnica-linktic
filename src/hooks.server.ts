// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get('token');

  if (token) {
    try {
      const decoded = jwt.verify(token, 'manug9704') as { userId: number };
      event.locals.userId = decoded.userId;
    } catch (error) {
      // Token inválido, no se hace nada
    }
  }

  const response = await resolve(event);
  return response;
};