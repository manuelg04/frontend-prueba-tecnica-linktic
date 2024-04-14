// src/routes/+layout.ts
import { goto } from '$app/navigation';
import { get } from 'svelte/store';
import { authStore } from '../stores/auth';

export function load() {
  const $authStore = get(authStore);
  if ($authStore.token && $authStore.isAuthenticated) {
    goto('/dashboard');
  }
}