import type { RequestEvent } from '@sveltejs/kit';
import { registerUser } from '$lib/server/user.controller';

export const POST = async (event: RequestEvent): Promise<Response> => {
  const response = await registerUser(event);
  
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  return new Response(JSON.stringify(response.body), {
    status: response.status,
    headers: headers,
  });
};