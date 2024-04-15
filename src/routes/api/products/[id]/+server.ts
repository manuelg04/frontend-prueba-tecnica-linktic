import type { RequestEvent } from '@sveltejs/kit';
import { updateProduct, deleteProduct } from '$lib/server/product.controller';

export const PUT = async (event: RequestEvent) => {
  return await updateProduct(event);
};

export const DELETE = async (event: RequestEvent) => {
  return await deleteProduct(event);
};