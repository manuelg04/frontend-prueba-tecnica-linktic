// src/routes/+layout.js
import { authStore } from '../stores/auth';
import { get } from 'svelte/store';
import { redirect } from '@sveltejs/kit';

export async function load({ url }) {
  const { isAuthenticated } = get(authStore);
  
  if (!isAuthenticated && url.pathname === '/dashboard') {
    throw redirect(302, '/');
  }
  
  return {};
}