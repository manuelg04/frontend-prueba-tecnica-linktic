import type { RequestEvent } from '@sveltejs/kit';
import { getProducts, updateProduct, deleteProduct, createProduct } from '$lib/server/product.controller';

export const GET = async () => {
  return await getProducts();
};

export const POST = async (event: RequestEvent) => {
  return await createProduct(event);
};

export const PUT = async (event: RequestEvent) => {
  return await updateProduct(event);
};

export const DELETE = async (event: RequestEvent) => {
  return await deleteProduct(event);
};