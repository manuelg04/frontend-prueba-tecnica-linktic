// src/lib/services/productService.ts
import axios from 'axios';
import type { Product } from '$lib/interfaces/product.interface';
import { PUBLIC_API_URL } from '$env/static/public';

const API_URL = PUBLIC_API_URL;
export async function fetchProducts(token: string | null): Promise<Product[]> {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const response = await axios.get(API_URL, config);
  return response.data;
}

export async function createProduct(product: Partial<Product>, token: string | null): Promise<Product> {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  console.log(API_URL);
  const response = await axios.post(API_URL, product, config);
  return response.data;
}

export async function updateProduct(productId: number, product: Partial<Product>, token: string | null): Promise<Product> {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const response = await axios.put(`${API_URL}/${productId}`, product, config);
  return response.data;
}

export async function deleteProduct(productId: number, token: string | null): Promise<void> {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  await axios.delete(`${API_URL}/${productId}`, config);
}