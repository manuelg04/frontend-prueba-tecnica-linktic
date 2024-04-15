import type { RequestEvent } from '@sveltejs/kit';
import { error, json } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createOrder = async (event: RequestEvent): Promise<Response> => {
  const { cartProducts, userId } = await event.request.json();

  try {
    const productIds = cartProducts.map((product: any) => product.id);
    const totalPrice = cartProducts.reduce((total: number, product: any) => total + Number(product.price), 0);

    const newOrder = await prisma.order.create({
      data: {
        totalPrice,
        user: { connect: { id: userId } },
        products: { connect: productIds.map((productId: number) => ({ id: productId })) },
      },
      include: { products: true, user: true },
    });

    return json(newOrder, { status: 201 });
  } catch (err: any) {
    console.error(err.message);
    throw error(500, 'Error creating order');
  }
};

export const getOrders = async (): Promise<Response> => {
    console.log('entrando en getOrders')
  try {
    const orders = await prisma.order.findMany({
      include: { products: true },
    });
    return json(orders);
  } catch (err: any) {
    throw error(500, 'Error retrieving orders');
  }
};

export const getOrdersByUserId = async (event: RequestEvent): Promise<Response> => {
  const { userId } = event.params;
  console.log("🚀 ~ userId:", userId)

  try {
    const orders = await prisma.order.findMany({
      where: { userId: Number(userId) },
      include: { products: true },
    });
    return json(orders);
  } catch (err: any) {
    console.error(err.message);
    throw error(500, 'Error retrieving orders');
  }
};

export const updateOrder = async (event: RequestEvent): Promise<Response> => {
  const { orderId } = event.params;
  const userId = event.locals.userId;
  const { productIds } = await event.request.json();

  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(orderId) },
    });

    if (!order || order.userId !== userId) {
      throw error(403, 'You do not have permission to update this order');
    }

    const updatedOrder = await prisma.order.update({
      where: { id: Number(orderId) },
      data: {
        products: { set: productIds.map((productId: number) => ({ id: productId })) },
      },
      include: { products: true },
    });

    const totalPrice = updatedOrder.products.reduce((total: number, product: any) => total + Number(product.price), 0);

    await prisma.order.update({
      where: { id: Number(orderId) },
      data: { totalPrice },
    });

    return json(updatedOrder);
  } catch (err: any) {
    throw error(500, 'Error updating order');
  }
};

export const deleteOrder = async (event: RequestEvent): Promise<Response> => {
  const { id } = event.params;

  try {
    await prisma.order.delete({
      where: { id: Number(id) },
    });
    return new Response(null, { status: 204 });
  } catch (err: any) {
    throw error(500, 'Error deleting order');
  }
};