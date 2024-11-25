<script lang="ts">
	import { onMount } from 'svelte';
	// import { auth } from '$lib/firebase';
	import { user, loading, initialized } from '$lib/stores/authStore';
	import { theme } from '$lib/stores/themeStore';
	import { toggleMode } from 'mode-watcher';
	import { ModeWatcher } from 'mode-watcher';
	import { browser } from '$app/environment';
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import type { LayoutServerData } from './$types';
	import type { Snippet } from 'svelte';
	import { Button } from "$lib/components/ui/button/index.js";
	import Sun from "lucide-svelte/icons/sun";
	import Moon from "lucide-svelte/icons/moon";

	
	interface Props {
		children?: Snippet;
		data: LayoutServerData;
	}

	let { children, data }: Props = $props();

	$effect(() => {
		console.log('data:', data);
		user.set(data?.user);
	});

	// onMount(() => {
	//   if (browser && auth) {
	//     const unsubscribe = auth.onAuthStateChanged((userData) => {
	//       loading.set(false);
	//       initialized.set(true);
	//     });

	//     return () => {
	//       unsubscribe();
	//     };
	//   }
	// });
</script>

<ModeWatcher />

<div
	class="flex min-h-screen flex-col bg-white text-gray-900 transition-colors dark:bg-gray-900 dark:text-gray-100"
>
	<Navbar />


  <Button onclick={toggleMode} variant="outline" size="icon" class='fixed bottom-4 right-4 z-50 rounded-full bg-gray-200 p-2 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600'>
    <Sun
      class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
    />
    <Moon
      class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
    />
    <span class="sr-only">Toggle theme</span>
  </Button>
	<main class="flex-grow">
		{@render children?.()}
	</main>
</div>
