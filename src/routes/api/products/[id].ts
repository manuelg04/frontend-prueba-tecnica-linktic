import type { RequestEvent } from '@sveltejs/kit';
import { getProductById, updateProduct, deleteProduct } from '$lib/server/product.controller';

export const GET = async (event: RequestEvent) => {
  return await getProductById(event);
};

export const PUT = async (event: RequestEvent) => {
  return await updateProduct(event);
};

export const DELETE = async (event: RequestEvent) => {
  return await deleteProduct(event);
};