<!-- src/routes/dashboard/+page.svelte -->
<script lang="ts">
    import { authStore } from '../../stores/auth';
    import { onMount } from 'svelte';
    import { fetchProducts, createProduct, updateProduct, deleteProduct } from '$lib/services/productService';
	import type { Product } from '$lib/interfaces/product.interface';
  
    let products: Product[] = [];
    let selectedProduct: Product | null = null;
    let name = '';
    let description = '';
    let price = 0;
  
    onMount(async () => {
      products = await fetchProducts($authStore.token);
    });
  
    async function handleCreateProduct() {
      const newProduct = await createProduct({ name, description, price }, $authStore.token);
      products = [...products, newProduct];
      resetForm();
    }
  
    async function handleUpdateProduct() {
      if (selectedProduct) {
        const updatedProduct = await updateProduct(selectedProduct.id, { name, description, price }, $authStore.token);
        const updatedProductIndex = products.findIndex((p) => p.id === selectedProduct?.id);
        products[updatedProductIndex] = updatedProduct;
        products = products;
        resetForm();
      }
    }
  
    async function handleDeleteProduct(productId: number) {
    if ($authStore.token) {
      await deleteProduct(productId, $authStore.token);
      products = products.filter((p) => p.id !== productId);
    }
  }
  
    function selectProduct(product: Product) {
      selectedProduct = product;
      name = product.name;
      description = product.description;
      price = product.price;
    }
  
    function resetForm() {
      selectedProduct = null;
      name = '';
      description = '';
      price = 0;
    }
  </script>
  
  {#if $authStore.isAuthenticated && $authStore.token}
    <div class="container mx-auto px-4">
      <h1 class="text-2xl font-bold mb-4">Product Dashboard</h1>
  
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-white p-4 rounded shadow">
          <h2 class="text-xl font-bold mb-4">
            {selectedProduct ? 'Edit Product' : 'Create Product'}
          </h2>
          <form on:submit|preventDefault={() => {
            if (selectedProduct) {
              handleUpdateProduct();
            } else {
              handleCreateProduct();
            }
          }}>
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
                    <h3 class="text-lg font-bold">{product.name}</h3>
                    <p class="text-gray-600">{product.description}</p>
                    <p class="text-gray-800">${product.price}</p>
                  </div>
                  <div>
                    <button
                      class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mr-2"
                      on:click={() => selectProduct(product)}
                    >
                      Edit
                    </button>
                    <button class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                    on:click={() => handleDeleteProduct(product.id)}
                  >
                      Delete
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