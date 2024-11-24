<script lang="ts">
  import { onMount } from 'svelte';
  import { auth } from '$lib/firebase';
  import { user, loading, initialized } from '$lib/stores/authStore';
  import { browser } from '$app/environment';
  import '../app.css';
  import Navbar from '$lib/components/Navbar.svelte';

  onMount(() => {
    if (browser && auth) {
      const unsubscribe = auth.onAuthStateChanged((userData) => {
        user.set(userData);
        loading.set(false);
        initialized.set(true);
      });

      return () => {
        unsubscribe();
      };
    }
  });
</script>

{#if $initialized}
  <div class="min-h-screen flex flex-col">
    <Navbar />
    <main class="flex-grow">
      <slot />
    </main>
  </div>
{:else}
  <div class="min-h-screen flex items-center justify-center">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
  </div>
{/if}
