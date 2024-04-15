import type { RequestEvent } from '@sveltejs/kit';
import { getOrders, createOrder, updateOrder, deleteOrder } from '$lib/server/order.controller';

export const GET = async (event: RequestEvent) => {
  return await getOrders();
};

export const POST = async (event: RequestEvent) => {
  return await createOrder(event);
};

export const PUT = async (event: RequestEvent) => {
  return await updateOrder(event);
};

export const DELETE = async (event: RequestEvent) => {
  return await deleteOrder(event);
};