import type { RequestEvent } from '@sveltejs/kit';
import { getOrders, createOrder} from '$lib/server/order.controller';

export const GET = async (event: RequestEvent) => {
  return await getOrders();
};

export const POST = async (event: RequestEvent) => {
  return await createOrder(event);
};

