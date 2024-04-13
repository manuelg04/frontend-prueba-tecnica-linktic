<script lang="ts">
    import axios from 'axios';
    import { onMount } from 'svelte';
    import "../../app.css"
	import { goto } from '$app/navigation';
  
    let email = '';
    let password = '';
    let error = '';
  
    const handleRegister = async () => {
      try {
        const response = await axios.post('http://localhost:3000/auth/register', {
          email,
          password,
        });
        if (response.status === 200) {
          goto('/dashboard')
        }
   
        console.log("🚀 ~ response:", response)
        // Manejar la respuesta del backend (por ejemplo, mostrar un mensaje de éxito)
        // Redirigir al usuario a la página de inicio de sesión después del registro exitoso
      } catch (error) {
        console.error("🚀 ~ error:", error)
        error = 'Error occurred during registration. Please try again.';
      }
    };
  </script>
  
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6">Register</h2>
      {#if error}
        <p class="text-red-500 mb-4">{error}</p>
      {/if}
      <form on:submit|preventDefault={handleRegister}>
        <div class="mb-4">
          <label for="email" class="block mb-2">Email</label>
          <input
            type="email"
            id="email"
            bind:value={email}
            class="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div class="mb-6">
          <label for="password" class="block mb-2">Password</label>
          <input
            type="password"
            id="password"
            bind:value={password}
            class="w-full px-3 py-2 border border-gray-300 rounded"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded"
        >
          Register
        </button>
      </form>
      <p class="mt-4">
        Already have an account? <a href="/" class="text-blue-500">Login here</a>
      </p>
    </div>
  </div>