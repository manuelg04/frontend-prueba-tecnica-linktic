import type { RequestEvent } from '@sveltejs/kit';
import { updateOrder, deleteOrder } from '$lib/server/order.controller';

export const PUT = async (event: RequestEvent) => {
    return await updateOrder(event);
  };
  
  export const DELETE = async (event: RequestEvent) => {
    return await deleteOrder(event);
  };