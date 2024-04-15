import type { RequestEvent } from '@sveltejs/kit';
import { loginUser } from '$lib/server/user.controller';

export const POST = async (event: RequestEvent) => {
  return await loginUser(event);
};