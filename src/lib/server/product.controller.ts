import type { RequestEvent } from '@sveltejs/kit';
import { error, json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createProduct = async (event: RequestEvent): Promise<Response> => {
  const { name, description, price } = await event.request.json();
  const userId = event.locals.userId;

  if (!userId) {
    throw error(401, 'Unauthorized');
  }

  try {
    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        userId,
      },
    });
    return json(newProduct, { status: 201 });
  } catch (err: any) {
    throw error(500, 'Error creating product');
  }
};

export const getProducts = async (): Promise<Response> => {
  try {
    const products = await prisma.product.findMany();
    return json(products);
  } catch (err: any) {
    throw error(500, 'Error retrieving products');
  }
};

export const getProductById = async (event: RequestEvent): Promise<Response> => {
  const { id } = event.params;

  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
    });

    if (product) {
      return json(product);
    } else {
      throw error(404, 'Product not found');
    }
  } catch (err: any) {
    throw error(500, 'Error retrieving product');
  }
};

export const updateProduct = async (event: RequestEvent): Promise<Response> => {
    console.log('entrando en updateProduct')
  const { id } = event.params;
  const userId = event.locals.userId;
  const { name, description, price } = await event.request.json();

  try {
    const product = await prisma.product.findUnique({ where: { id: Number(id) } });

    if (!product) {
      throw error(404, 'Product not found');
    }

    if (product.userId !== userId) {
      throw error(403, "You do not have permission to alter someone else's product");
    }

    const updatedProduct = await prisma.product.update({
      where: { id: Number(id) },
      data: { name, description, price },
    });

    return json(updatedProduct);
  } catch (err: any) {
    throw error(500, 'Error updating product');
  }
};

export const deleteProduct = async (event: RequestEvent): Promise<Response> => {
  const { id } = event.params;
  const userId = event.locals.userId;

  try {
    const product = await prisma.product.findUnique({ where: { id: Number(id) } });

    if (!product) {
      throw error(404, 'Product not found');
    }

    if (product.userId !== userId) {
      throw error(403, "You do not have permission to delete someone else's product");
    }

    await prisma.product.delete({
      where: { id: Number(id) },
    });

    return new Response(null, { status: 204 });
  } catch (err: any) {
    console.log("🚀 ~ err:", err)
    throw error(err.status || 500, err.message || 'Error deleting product');
  }
};