import type { RequestEvent } from '@sveltejs/kit';
import { getOrdersByUserId, updateOrder, deleteOrder } from '$lib/server/order.controller';

export const GET = async (event: RequestEvent) => {
  return await getOrdersByUserId(event);
};

export const PUT = async (event: RequestEvent) => {
  return await updateOrder(event);
};

export const DELETE = async (event: RequestEvent) => {
  return await deleteOrder(event);
};