<script lang="ts">
    import axios from 'axios';
    import { onMount } from 'svelte';
	import "../app.css"
	import { goto } from '$app/navigation';
	import { authStore } from '../stores/auth';
  
    let email = '';
    let password = '';
    let error = '';
  
    const handleLogin = async () => {
      try {
        const response = await axios.post('http://localhost:3000/auth/login', {
          email,
          password,
        });
        console.log("🚀 ~ response:", response)
		if (response.status === 200) {
			const { token } = response.data;
      		authStore.set({ token, isAuthenticated: true, user: response.data.user});
		  goto('/dashboard')
		}
		
        // Manejar la respuesta del backend (por ejemplo, guardar el token en localStorage)
        // Redirigir a la página principal después del inicio de sesión exitoso
      } catch (err) {
        error = 'Invalid credentials. Please try again.';
      }
    };
  </script>
  
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6">Login</h2>
      {#if error}
        <p class="text-red-500 mb-4">{error}</p>
      {/if}
      <form on:submit|preventDefault={handleLogin}>
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
          Login
        </button>
      </form>
      <p class="mt-4">
        Don't have an account? <a href="/register" class="text-blue-500">Register here</a>
      </p>
    </div>
  </div>