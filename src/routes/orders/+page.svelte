<script lang="ts">
    import { onMount } from 'svelte';
    import { authStore } from '../../stores/auth';
    import axios from 'axios';
    import "../../app.css"
	import Navbar from '../../components/Navbar.svelte';
    import OrderModal from '../../components/Order.svelte';
	import Swal from 'sweetalert2';
	import { PUBLIC_API_URL_ORDERS } from '$env/static/public';
    let orders: any[] = [];
  
    onMount(async () => {
      await fetchOrders();
    });
  
    async function fetchOrders() {
      try {
        const userId = $authStore.userId;
        console.log("🚀 ~ userId:", userId)
        console.log(typeof userId)
        const token = $authStore.token;
  
        if (userId && token) {
          console.log(`${PUBLIC_API_URL_ORDERS}/${userId}`)
          const response = await axios.get(`${PUBLIC_API_URL_ORDERS}/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("🚀 ~ response:", response)
          orders = response.data;
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    }
  
    async function deleteOrder(orderId: number) {
      try {
        const token = $authStore.token;
        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }).then(async (result) => {
          if (result.isConfirmed) {
            if (token) {
              console.log("🚀 ~ orderId:", orderId)
              const response = await axios.delete(`${PUBLIC_API_URL_ORDERS}/${orderId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                
              });
              console.log("🚀 ~ response:", response)
              await fetchOrders();
              Swal.fire(
                'Deleted!',
                'Your order has been deleted.',
                'success'
              )
            }
          }
        })
  
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  
    async function updateOrder(orderId: number) {
      console.log("🚀 ~ orderId:", orderId)
      try {
        const token = $authStore.token;
        if (token) {
          await axios.put(`${PUBLIC_API_URL_ORDERS}/${orderId}`, {
          
          }, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          await fetchOrders();
        }
      } catch (error) {
        console.log('Error updating order:', error);
      }
    }

    let isModalOpen = false;
  let selectedOrder: any = null;

  function openModal(order: any) {
    console.log(order)
    selectedOrder = order;
    isModalOpen = true;
  }

  function closeModal() {
    selectedOrder = null;
    isModalOpen = false;
  }
  </script>
  
  <main class="container mx-auto px-4 py-8">
    <Navbar />
    <OrderModal isOpen={isModalOpen} order={selectedOrder} on:close={closeModal} />
    
    <div class="my-8">
      <h1 class="text-4xl font-bold text-center text-blue-600 mb-4">My Orders</h1>
    </div>
  
    <div class="overflow-x-auto">
      {#if orders.length === 0}
      <p class="text-center text-gray-500 py-8">No orders found. You haven't placed any orders yet.</p>
    {:else}
      <table class="w-full table-auto bg-white rounded-lg shadow-lg">
        <thead>
          <tr class="bg-blue-500 text-white">
            <th class="px-6 py-4 text-left">Order ID</th>
            <th class="px-6 py-4 text-left">Order Date</th>
            <th class="px-6 py-4 text-left">Total</th>
            <th class="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each orders as order}
            <tr class="border-b border-gray-200 hover:bg-gray-100">
              <td class="px-6 py-4">{order.id}</td>
              <td class="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
              <td class="px-6 py-4">{order.totalPrice}</td>
              <td class="px-6 py-4 text-center">
                <button
                  class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md mr-2"
                  on:click={() => deleteOrder(order.id)}
                >
                  Delete
                </button>
                <button
                  class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md"
                  on:click={() => openModal(order)}
                >
                  Update
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
    </div>
  </main>