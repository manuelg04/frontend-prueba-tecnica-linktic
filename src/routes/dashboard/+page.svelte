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
			console.log('Updating product:', selectedProduct);
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
		<div class="my-8">
			<h1 class="text-4xl font-bold text-center text-blue-600 mb-4">Welcome to Your Product Dashboard</h1>
			<h2 class="text-2xl font-semibold text-center text-gray-600">Hello, {$authStore.email}!</h2>
		</div>
		<div class="flex justify-end mb-8">
			<button
				class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center"
				on:click={toggleCart}
			>
				<svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
				</svg>
				<span class="text-lg">({cart.length})</span>
			</button>
			{#if showCart}
				<Cart {cart} on:removeProduct={handleRemoveProduct} />
			{/if}
		</div>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
			<div class="bg-white p-6 rounded-lg shadow-lg">
				<h2 class="text-2xl font-semibold mb-4">
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
						<label for="name" class="block mb-2 font-semibold">Name</label>
						<input
							type="text"
							id="name"
							bind:value={name}
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>
					<div class="mb-4">
						<label for="description" class="block mb-2 font-semibold">Description</label>
						<textarea
							id="description"
							bind:value={description}
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						></textarea>
					</div>
					<div class="mb-6">
						<label for="price" class="block mb-2 font-semibold">Price</label>
						<input
							type="number"
							id="price"
							bind:value={price}
							class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							required
						/>
					</div>
					<button
						type="submit"
						class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md"
					>
						{selectedProduct ? 'Update' : 'Create'}
					</button>
					{#if selectedProduct}
						<button
							type="button"
							class="ml-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md"
							on:click={resetForm}
						>
							Cancel
						</button>
					{/if}
				</form>
			</div>

			<div class="bg-white p-6 rounded-lg shadow-lg">
				<h2 class="text-2xl font-semibold mb-4">Product List</h2>
				{#if products.length === 0}
					<p class="text-gray-600">No products found.</p>
				{:else}
					<ul class="space-y-6">
						{#each products as product}
							<li class="flex items-center justify-between bg-gray-100 p-4 rounded-lg shadow-md">
								<div>
									<h3 class="text-xl font-semibold">{product?.name}</h3>
									<p class="text-gray-600">{product?.description}</p>
									<p class="text-gray-800 font-semibold">${product?.price}</p>
								</div>
								<div class="flex space-x-2">
									<button
										class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
										on:click={() => product && selectProduct(product)}
									>
										Edit
									</button>
									<button
										class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
										on:click={() => product?.id && handleDeleteProduct(product.id)}
									>
										Delete
									</button>
									<button
										class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
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
		<div class="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto">
			<h2 class="text-3xl font-bold text-center text-red-600 mb-6">Unauthorized</h2>
			<p class="text-xl text-center text-gray-600">You are not authorized to view this page. Please log in.</p>
		</div>
	</div>
{/if}
