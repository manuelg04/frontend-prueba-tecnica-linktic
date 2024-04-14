<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import '../app.css';
    export let isOpen = false;
    export let order: any = null;
  
    const dispatch = createEventDispatcher();
    function closeModal() {
      dispatch('close');
    }
  
    function updateOrder() {
      // Lógica para actualizar la orden
      console.log('Actualizando orden:', order);
      closeModal();
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
              <span>${product.price}</span>
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