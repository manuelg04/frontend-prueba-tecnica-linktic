// src/stores/auth.js
import { writable } from 'svelte/store';

const initialAuthState = {
  token: typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null,
  isAuthenticated: typeof localStorage !== 'undefined' ? localStorage.getItem('isAuthenticated') === 'true' : false,
   userId: typeof localStorage !== 'undefined' ? parseInt(localStorage.getItem('userId')) || null : null,
};

export const authStore = writable(initialAuthState);

authStore.subscribe((value) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('token', value.token);
    localStorage.setItem('isAuthenticated', value.isAuthenticated.toString());
    localStorage.setItem('userId', value.userId);
  }
});