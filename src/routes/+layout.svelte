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
	<button
		class="fixed bottom-4 right-4 rounded-full bg-gray-200 p-2 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
		onclick={toggleMode}
		aria-label="Toggle theme"
	>
		{#if $theme === 'dark'}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
				/>
			</svg>
		{:else}
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
				/>
			</svg>
		{/if}
	</button>
	<main class="flex-grow">
		{@render children?.()}
	</main>
</div>
