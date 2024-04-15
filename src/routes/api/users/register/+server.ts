import type { RequestEvent } from '@sveltejs/kit';
import { registerUser } from '$lib/server/user.controller';

export const POST = async (event: RequestEvent) => {
  return await registerUser(event);
};