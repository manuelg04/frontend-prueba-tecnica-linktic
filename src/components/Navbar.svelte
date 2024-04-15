<!-- src/components/Navbar.svelte -->
<script lang="ts">
	import '../app.css';
	import { goto } from '$app/navigation';
	import { authStore } from '../stores/auth';
	import axios from 'axios';
	import { PUBLIC_API_URL_USERS } from '$env/static/public';	

	async function handleLogout() {
		try {
			const userId = $authStore.userId;
			console.log("🚀 ~ userId:", userId)
			await axios.post(`${PUBLIC_API_URL_USERS}/logout`, { userId });
			authStore.set({
				token: null,
				isAuthenticated: false,
				userId: null
			});
			localStorage.removeItem('cart');

			goto('/');
		} catch (error) {
			console.error('Error logging out:', error);
		}
	}
</script>

<nav class="bg-white shadow-md">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between h-16">
			<div class="flex">
				<div class="hidden sm:ml-6 sm:flex sm:space-x-8">
					<a
						href="/dashboard"
						class="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium hover:border-gray-300"
					>
						Products
					</a>
					<a
						href="/orders"
						class="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium hover:border-gray-300"
					>
						Orders
					</a>
				</div>
			</div>
			<div class="hidden sm:ml-6 sm:flex sm:items-center">
				<button
					type="button"
					class="bg-white p-1 rounded-full text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					on:click={handleLogout}
				>
					<span class="sr-only">Logout</span>
					<svg
						class="h-6 w-6"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
						/>
					</svg>
				</button>
			</div>
			<div class="-mr-2 flex items-center sm:hidden">
				<button
					type="button"
					class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
					aria-expanded="false"
				>
					<span class="sr-only">Open main menu</span>
					<svg
						class="block h-6 w-6"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
						aria-hidden="true"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				</button>
			</div>
		</div>
	</div>

	<!-- Mobile menu, show/hide based on menu state. -->
	<div class="sm:hidden" id="mobile-menu">
		<div class="pt-2 pb-3 space-y-1">
			<a
				href="/products"
				class="text-gray-900 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium hover:bg-gray-50 hover:border-gray-300"
			>
				Products
			</a>
			<a
				href="/orders"
				class="text-gray-900 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium hover:bg-gray-50 hover:border-gray-300"
			>
				Orders
			</a>
			<a
				href="/"
				class="text-gray-900 block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium hover:bg-gray-50 hover:border-gray-300"
				on:click|preventDefault={handleLogout}
			>
				Logout
			</a>
		</div>
	</div>
</nav>
