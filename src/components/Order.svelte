<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import '../app.css';
	import { fetchProducts } from '$lib/services/productService';
    import { authStore } from '../stores/auth';
	import type { Product } from '$lib/interfaces/product.interface';
	import Swal from 'sweetalert2';
	import axios from 'axios';
	import { PUBLIC_API_URL_ORDERS } from '$env/static/public';



    export let isOpen = false;
    export let order: any = null;
    let products: Product[] = [];
  
    const dispatch = createEventDispatcher();
    function closeModal() {
      dispatch('close');
    }

    async function loadProducts() {
    products = await fetchProducts($authStore.token);
  }
  
    function updateOrder() {
      Swal.fire({
        title: 'Orden actualizada',
        text: `La orden con el ID: ${order.id} ha sido actualizada con éxito.`,
        icon: 'success',
        confirmButtonText: 'Ok'
      });
      closeModal();
    }
    async function removeProduct(productId: number) {
    order.products = order.products.filter((product: Product) => product.id !== productId);
    order.totalPrice = calculateTotal();

    try {
      const token = $authStore.token;
      if (token) {
        await axios.put(`${PUBLIC_API_URL_ORDERS}/${order.id}`, {
          products: order.products.map((product: Product) => product.id),
          totalPrice: order.totalPrice,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  }

  function calculateTotal(): string {
    const total = order.products.reduce((sum: number, product: Product) => sum + Number(product.price), 0);
    return total.toFixed(2);
  }

  $: if (isOpen && order) {
    loadProducts();
  }
  </script>
  
  {#if isOpen && order}
  <div class="fixed inset-0 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
      <h2 class="text-2xl font-bold mb-4">Detalles de la orden</h2>
      <p class="mb-4"><strong>ID de la orden:</strong> {order.id}</p>
      <p class="mb-4"><strong>Fecha de creación:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
      <p class="mb-4"><strong>Total:</strong> ${order.totalPrice}</p>
      <h3 class="text-xl font-bold mb-2">Productos:</h3>
      <ul class="mb-4">
        {#each order.products as product}
          <li class="flex justify-between items-center py-2">
            <span>{product.name}</span>
            <div class="flex items-center">
              <span class="mr-2">${product.price}</span>
              <button class="text-red-500 hover:text-red-700" on:click={() => removeProduct(product.id)}>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </li>
        {/each}
      </ul>
      <button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" on:click={updateOrder}>
        Actualizar Orden
      </button>
      <button class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mt-4" on:click={closeModal}>
        Cerrar
      </button>
    </div>
  </div>
{/if}