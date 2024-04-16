import type { RequestEvent } from '@sveltejs/kit';
import { createOrder} from '$lib/server/order.controller';


export const POST = async (event: RequestEvent) => {
  return await createOrder(event);
};

