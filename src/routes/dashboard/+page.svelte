<!-- src/routes/dashboard/+page.svelte -->
<script lang="ts">
    import { authStore } from '../../stores/auth';
    import { onMount } from 'svelte';
    import axios from 'axios';
    import type { Product } from '$lib/images/interfaces/product.interface';

    let products: Product[] = [];
    let selectedProduct: Product | null = null;
    let name = '';
    let description = '';
    let price = 0;
  
    onMount(async () => {
      await fetchProducts();
    });
  
    async function fetchProducts() {
      try {
        const response = await axios.get('http://localhost:3000/products', {
          headers: {
            Authorization: `Bearer ${$authStore.token}`,
          },
        });
        products = response.data;
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    }
  
    async function createProduct() {
      try {
        const response = await axios.post(
          'http://localhost:3000/products',
          {
            name,
            description,
            price,
          },
          {
            headers: {
              Authorization: `Bearer ${$authStore.token}`,
            },
          }
        );
        //TODO: Handle response
        products = [...products, response.data];
        resetForm();
      } catch (error) {
        console.error('Error creating product:', error);
      }
    }
  
    async function updateProduct() {
      try {
        const response = await axios.put(
          `http://localhost:3000/products/${selectedProduct?.id}`,
          {
            name,
            description,
            price,
          },
          {
            headers: {
              Authorization: `Bearer ${$authStore.token}`,
            },
          }
        );
        //TODO: Handle response
        const updatedProductIndex = products.findIndex(
          (p) => p.id === selectedProduct?.id
        );
        products[updatedProductIndex] = response.data;
        products = products;
        resetForm();
      } catch (error) {
        console.error('Error updating product:', error);
      }
    }
  
    async function deleteProduct(productId: number) {
      try {
        const response = await axios.delete(`http://localhost:3000/products/${productId}`, {
          headers: {
            Authorization: `Bearer ${$authStore.token}`,
          },
        });
        //TODO: Handle response
        products = products.filter((p) => p.id !== productId);
      } catch (error) {
        console.error('Error deleting product:', error);
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
  
  {#if $authStore.isAuthenticated}
    <div class="container mx-auto px-4">
      <h1 class="text-2xl font-bold mb-4">Product Dashboard</h1>
  
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-white p-4 rounded shadow">
          <h2 class="text-xl font-bold mb-4">
            {selectedProduct ? 'Edit Product' : 'Create Product'}
          </h2>
          <form on:submit|preventDefault={selectedProduct ? updateProduct : createProduct}>
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
                    <button
                      class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                      on:click={() => deleteProduct(product.id)}
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