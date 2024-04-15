// src/lib/services/productService.ts
import axios from 'axios';
import type { Product } from '$lib/interfaces/product.interface';
import { PUBLIC_API_URL_PRODUCTS } from '$env/static/public';
import Swal from 'sweetalert2';

const API_URL = PUBLIC_API_URL_PRODUCTS;
export async function fetchProducts(token: string | null): Promise<Product[]> {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const response = await axios.get(API_URL, config);
  return response.data;
}

export async function createProduct(product: Partial<Product>, token: string | null): Promise<Product | null> {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

  try {
    const response = await axios.post(API_URL, product, config);

    if (response.status === 201) {
      Swal.fire('Success', 'Product created successfully', 'success');
      return response.data;
    } else {
      Swal.fire('Error', 'Unexpected response from server', 'error');
      return null;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const { status, data } = error.response;

        switch (status) {
          case 400:
            Swal.fire('Error', 'User ID is required', 'error');
            break;
          case 401:
            Swal.fire('Error', 'Unauthorized', 'error');
            break;
          case 403:
            Swal.fire('Error', 'Forbidden', 'error');
            break;
          case 404:
            Swal.fire('Error', 'Product not found', 'error');
            break;
          case 500:
            Swal.fire('Error', 'Internal server error', 'error');
            break;
          default:
            Swal.fire('Error', 'An error occurred', 'error');
            break;
        }
      } else if (error.request) {
        Swal.fire('Error', 'No response from server', 'error');
      } else {
        Swal.fire('Error', 'Error creating product', 'error');
      }
    } else {
      Swal.fire('Error', 'An error occurred', 'error');
    }

    return null;
  }
}

export async function updateProduct(productId: number, product: Partial<Product>, token: string | null): Promise<Product | null> {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

  try {
    const response = await axios.put(`${API_URL}/${productId}`, product, config);

    if (response.status === 200) {
      Swal.fire('Success', 'Product updated successfully', 'success');
      return response.data;
    } else {
      Swal.fire('Error', 'Unexpected response from server', 'error');
      return null;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        const { status, data } = error.response;

        switch (status) {
          case 400:
            Swal.fire('Error', 'Bad request', 'error');
            break;
          case 401:
            Swal.fire('Error', 'Unauthorized', 'error');
            break;
          case 403:
            Swal.fire('Error', "You do not have permission to alter someone else's product", 'error');
            break;
          case 404:
            Swal.fire('Error', 'Product not found', 'error');
            break;
          case 500:
            Swal.fire('Error', 'Internal server error', 'error');
            break;
          default:
            Swal.fire('Error', 'An error occurred', 'error');
            break;
        }
      } else if (error.request) {
        Swal.fire('Error', 'No response from server', 'error');
      } else {
        Swal.fire('Error', 'Error updating product', 'error');
      }
    } else {
      Swal.fire('Error', 'An error occurred', 'error');
    }

    return null;
  }
}

export async function deleteProduct(productId: number, token: string | null): Promise<boolean> {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  try {
    const response = await axios.delete(`${API_URL}/${productId}`, config);
    if (response.status === 204) {
      Swal.fire('Success', 'Product deleted successfully', 'success');
      return true;
    }
  } catch (error: any) {
    if (error.response) {
      const { status } = error.response;
      switch (status) {
        case 404:
          Swal.fire('Error', 'Product not found', 'error');
          break;
        case 403:
          Swal.fire('Error', "You do not have permission to delete someone else's product", 'error');
          break;
        case 500:
          Swal.fire('Error', 'Error deleting product', 'error');
          break;
        default:
          Swal.fire('Error', 'An unexpected error occurred', 'error');
      }
    } else {
      Swal.fire('Error', 'Failed to connect to the server', 'error');
    }
    return false;
  }
}