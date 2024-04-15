<!-- src/components/Cart.svelte -->
<script lang="ts">
	import type { Product } from '$lib/interfaces/product.interface';
	import axios from 'axios';
	import '../app.css';
	import { authStore } from '../stores/auth';
	import Swal from 'sweetalert2';
  import { createEventDispatcher } from 'svelte';
	import { PUBLIC_API_URL_ORDERS } from '$env/static/public';

	export let cart: Product[];
  $: {
    if (cart.length === 0) {
      localStorage.removeItem('cart');
    } else {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }
	let isOpen = true;
  const dispatch = createEventDispatcher();
	function removeFromCart(index: number) {
		cart.splice(index, 1);
		cart = cart;
    localStorage.setItem('cart', JSON.stringify(cart));
    dispatch('removeProduct');
	}

	async function createOrder(token: string | null) {
		try {
			const userId = cart[0].userId;
			const response = await axios.post(
				`${PUBLIC_API_URL_ORDERS}`,
				{
					cartProducts: cart,
					userId: userId
				},
				{
					headers: {
						Authorization: `Bearer ${$authStore.token}`
					}
				}
			);

			if (response.status === 201) {
				const newOrder = response.data;
				Swal.fire({
					title: 'Orden creada',
					text: `Orden creada con éxito con el ID: ${newOrder.id}`,
					icon: 'success',
					confirmButtonText: 'Ok'
				});
				cart = [];
				closeCart();
			}
		} catch (error) {
			console.error('Error al crear la orden:', error);
		}
	}

	function closeCart() {
		isOpen = false;
	}

	$: total = cart.reduce((acc, product) => acc + Number(product.price), 0).toFixed(2);
	$: formattedTotal = Number(total).toLocaleString(undefined, {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	});
</script>

{#if isOpen}
	<div class="fixed inset-0 flex items-center justify-center z-50">
		<div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
			<h2 class="text-2xl font-bold mb-4">Resumen de compra</h2>
			{#if cart.length === 0}
				<p>No hay productos en el carrito.</p>
			{:else}
				<ul class="mb-4">
					{#each cart as product, index}
						<li class="flex justify-between items-center py-2">
							<span>{product.name}</span>
							<span>${product.price}</span>
							<button
								class="text-red-500 hover:text-red-600 focus:outline-none"
								on:click={() => removeFromCart(index)}
							>
								<svg
									class="w-4 h-4"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M6 18L18 6M6 6l12 12"
									></path>
								</svg>
							</button>
						</li>
					{/each}
				</ul>
				<div class="flex justify-between items-center mb-4">
					<span class="text-lg font-bold">Total a pagar:</span>
					<span class="text-lg font-bold">${formattedTotal}</span>
				</div>
				<button
					class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
					on:click={createOrder}
				>
					Crear Orden
				</button>
			{/if}
			<button
				class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mt-4"
				on:click={closeCart}
			>
				Cerrar
			</button>
		</div>
	</div>
{/if}
