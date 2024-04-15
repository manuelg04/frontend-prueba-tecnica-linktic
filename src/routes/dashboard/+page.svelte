<!-- src/routes/dashboard/+page.svelte -->
<script lang="ts">
	import { authStore } from '../../stores/auth';
	import { onMount } from 'svelte';
	import {
		fetchProducts,
		createProduct,
		updateProduct,
		deleteProduct
	} from '$lib/services/productService';
	import type { Product } from '$lib/interfaces/product.interface';
	import Cart from '../../components/Cart.svelte';
	import Navbar from '../../components/Navbar.svelte';
	import { goto } from '$app/navigation';

	let products: (Product | null)[] = [];
	let selectedProduct: Product | null = null;
	let cart: Product[] = [];
	let name = '';
	let description = '';
	let price = 0;
	let showCart = false;

	onMount(async () => {
		if (!$authStore.token || !$authStore.isAuthenticated) {
			setTimeout(() => {
				goto('/');
			}, 2000);
		}
		products = await fetchProducts($authStore.token);
		const storedCart = localStorage.getItem('cart');
		console.log('🚀 ~ storedCart:', storedCart);
		if (storedCart) {
			cart = JSON.parse(storedCart);
		}
	});

	async function handleCreateProduct() {
		const newProduct = await createProduct({ name, description, price }, $authStore.token);
		products = [...products, newProduct];
		resetForm();
	}

	async function handleUpdateProduct() {
		if (selectedProduct) {
			const updatedProduct = await updateProduct(
				selectedProduct.id,
				{ name, description, price },
				$authStore.token
			);
			const updatedProductIndex = products.findIndex((p) => p?.id === selectedProduct?.id);
			products[updatedProductIndex] = updatedProduct;
			products = products;
			resetForm();
		}
	}

	async function handleDeleteProduct(productId: number) {
		if ($authStore.token) {
			await deleteProduct(productId, $authStore.token);
			products = products.filter((p) => p?.id !== productId);
		}
	}

	function addToCart(product: Product) {
		cart = [...cart, product];
		localStorage.setItem('cart', JSON.stringify(cart));
		console.log('Producto agregado al carrito:', product);
		console.log('Carrito actualizado:', cart);
	}
	// function removeFromCart(index: number) {
	// 	cart.splice(index, 1);
	// 	cart = cart;
	//   localStorage.setItem('cart', JSON.stringify(cart));
	// }

	function toggleCart() {
		showCart = !showCart;
	}

	function selectProduct(product: Product) {
		selectedProduct = product;
		name = product?.name || '';
		description = product?.description || '';
		price = product?.price || 0;
	}

	function resetForm() {
		selectedProduct = null;
		name = '';
		description = '';
		price = 0;
	}
  function handleRemoveProduct() {
		cart = cart;
	}
</script>

{#if $authStore.token && $authStore.isAuthenticated}
	<div class="container mx-auto px-4">
		<Navbar />
		<h1 class="text-2xl font-bold mb-4">Product Dashboard</h1>
		<div class="relative">
			<div class="relative">
				<button
					class="text-gray-600 hover:text-gray-800 focus:outline-none flex items-center"
					on:click={toggleCart}
				>
					<svg
						class="w-6 h-6 mr-1"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
						></path>
					</svg>
					<span class="text-sm font-bold">{cart.length}</span>
				</button>
			</div>
			{#if showCart}
				<Cart {cart} on:removeProduct={handleRemoveProduct} />
			{/if}
		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			<div class="bg-white p-4 rounded shadow">
				<h2 class="text-xl font-bold mb-4">
					{selectedProduct ? 'Edit Product' : 'Create Product'}
				</h2>
				<form
					on:submit|preventDefault={() => {
						if (selectedProduct) {
							handleUpdateProduct();
						} else {
							handleCreateProduct();
						}
					}}
				>
					<div class="mb-4">
						<label for="name" class="block mb-2">Name</label>
						<input
							type="text"
							id="name"
							bind:value={name}
							class="w-full px-3 py-2 border border-gray-300 rounded"
							required
						/>
					</div>
					<div class="mb-4">
						<label for="description" class="block mb-2">Description</label>
						<textarea
							id="description"
							bind:value={description}
							class="w-full px-3 py-2 border border-gray-300 rounded"
							required
						></textarea>
					</div>
					<div class="mb-4">
						<label for="price" class="block mb-2">Price</label>
						<input
							type="number"
							id="price"
							bind:value={price}
							class="w-full px-3 py-2 border border-gray-300 rounded"
							required
						/>
					</div>
					<button
						type="submit"
						class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
					>
						{selectedProduct ? 'Update' : 'Create'}
					</button>
					{#if selectedProduct}
						<button
							type="button"
							class="ml-2 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
							on:click={resetForm}
						>
							Cancel
						</button>
					{/if}
				</form>
			</div>

			<div class="bg-white p-4 rounded shadow">
				<h2 class="text-xl font-bold mb-4">Product List</h2>
				{#if products.length === 0}
					<p>No products found.</p>
				{:else}
					<ul class="space-y-4">
						{#each products as product}
							<li class="flex items-center justify-between">
								<div>
									<h3 class="text-lg font-bold">{product?.name}</h3>
									<p class="text-gray-600">{product?.description}</p>
									<p class="text-gray-800">${product?.price}</p>
								</div>
								<div>
									<button
										class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2"
										on:click={() => product && selectProduct(product)}
									>
										Edit
									</button>
									<button
										class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
										on:click={() => product?.id && handleDeleteProduct(product.id)}
									>
										Delete
									</button>
									<button
										class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
										on:click={() => product && addToCart(product)}
									>
										Add to Cart
									</button>
								</div>
							</li>
						{/each}
					</ul>
				{/if}
			</div>
		</div>
	</div>
{/if}

{#if !$authStore.token || !$authStore.isAuthenticated}
	<div class="min-h-screen flex items-center justify-center bg-gray-100">
		<div class="bg-white p-8 rounded shadow-md w-full max-w-md">
			<h2 class="text-2xl font-bold mb-6">Unauthorized</h2>
			<p class="text-red-500 mb-4">You are not authorized to view this page. Please log in.</p>
		</div>
	</div>
{/if}
