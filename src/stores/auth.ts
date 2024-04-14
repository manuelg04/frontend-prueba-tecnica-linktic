// src/stores/auth.js
import { writable } from 'svelte/store';

export const authStore = writable({
  token: null,
  isAuthenticated: false,
  user: null,
});