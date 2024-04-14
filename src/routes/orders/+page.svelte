<script lang="ts">
    import { onMount } from 'svelte';
    import { authStore } from '../../stores/auth';
    import axios from 'axios';
    import "../../app.css"
	import Navbar from '../../components/Navbar.svelte';
  
    let orders: any[] = [];
  
    onMount(async () => {
      await fetchOrders();
    });
  
    async function fetchOrders() {
      try {
        const userId = $authStore.user?.id;
        const token = $authStore.token;
  
        if (userId && token) {
          const response = await axios.get(`http://localhost:3000/orders/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          orders = response.data;
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    }
  
    async function deleteOrder(orderId: number) {
      try {
        const token = $authStore.token;
  
        if (token) {
          await axios.delete(`http://localhost:3000/orders/${orderId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          await fetchOrders();
        }
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  
    function updateOrder(orderId: number) {
      console.log('Updating order:', orderId);
    }
  </script>
  
  <main class="container mx-auto px-4 py-8">
    <Navbar />
    <h1 class="text-2xl font-bold mb-4">My Orders</h1>
  
    <table class="w-full table-auto">
      <thead>
        <tr class="bg-gray-200">
          <th class="px-4 py-2">Order ID</th>
          <th class="px-4 py-2">Order Date</th>
          <th class="px-4 py-2">Total</th>
          <th class="px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each orders as order}
          <tr class="bg-white hover:bg-gray-100">
            <td class="border px-4 py-2">{order.id}</td>
            <td class="border px-4 py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
            <td class="border px-4 py-2">{order.totalPrice}</td>
            <td class="border px-4 py-2">
              <button class="bg-red-500 text-white px-2 py-1 rounded mr-2" on:click={() => deleteOrder(order.id)}>Delete</button>
              <button class="bg-blue-500 text-white px-2 py-1 rounded" on:click={() => updateOrder(order.id)}>Update</button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </main>