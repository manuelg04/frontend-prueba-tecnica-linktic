<script>
    import { authStore } from '../../stores/auth';
    export let name = 'World';
</script>
{#if $authStore.isAuthenticated}
  <h1>Dashboard</h1>
  <h1>Hello, {name}!</h1>
{/if}
