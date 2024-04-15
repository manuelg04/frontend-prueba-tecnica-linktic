<script lang="ts">
    import { onMount } from 'svelte';
    import { authStore } from '../../stores/auth';
    import axios from 'axios';
    import "../../app.css"
	import Navbar from '../../components/Navbar.svelte';
    import OrderModal from '../../components/Order.svelte';
	import Swal from 'sweetalert2';
    let orders: any[] = [];
  
    onMount(async () => {
      await fetchOrders();
    });
  
    async function fetchOrders() {
      try {
        const userId = $authStore.userId;
        console.log(typeof userId)
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
              const response = await axios.delete(`http://localhost:3000/orders/${orderId}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
        
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
          await axios.put(`http://localhost:3000/orders/${orderId}`, {
          
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
              <button class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" on:click={() => openModal(order)}>
                Update
              </button>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </main>