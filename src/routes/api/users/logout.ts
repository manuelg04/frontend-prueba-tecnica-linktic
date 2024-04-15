import type { RequestEvent } from '@sveltejs/kit';
import { logoutUser } from '$lib/server/user.controller';

export const POST = async (event: RequestEvent) => {
  return await logoutUser(event);
};