import type { RequestEvent } from '@sveltejs/kit';
import { getProducts, createProduct } from '$lib/server/product.controller';

export const GET = async () => {
  return await getProducts();
};

export const POST = async (event: RequestEvent) => {
  return await createProduct(event);
};