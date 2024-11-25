<script lang="ts">
	import { page } from '$app/stores';
	import { getContext } from 'svelte';
	import { user } from '$lib/stores/authStore';

	let isMenuOpen = $state(false);
	let loading = $state(false);
	let isUserLoggedIn: boolean = $state(false);

	$effect(() => {
		console.log('user', $user);
		isUserLoggedIn = $user != null;
		console.log('isUserLoggedIn', isUserLoggedIn);
	});

	let isHome = $derived($page.url.pathname === '/');
	let isAbout = $derived($page.url.pathname === '/about');
	let isResources = $derived($page.url.pathname === '/resources');
	let isGames = $derived($page.url.pathname === '/games');
</script>

<nav class="bg-white shadow-lg dark:bg-gray-800">
	<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
		<div class="flex h-16 justify-between">
			<div class="flex">
				<div class="flex flex-shrink-0 items-center">
					<a href="/" class="text-xl font-bold text-green-700 dark:text-green-400">Earth Leaders</a>
				</div>
				<div class="hidden sm:ml-6 sm:flex sm:space-x-8">
					<a
						href="/"
						class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium {isHome
							? 'border-green-500 text-gray-900 dark:text-white'
							: 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300'}"
					>
						Home
					</a>
					<a
						href="/about"
						class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium {isAbout
							? 'border-green-500 text-gray-900 dark:text-white'
							: 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300'}"
					>
						About
					</a>
					{#if isUserLoggedIn}
						<a
							href="/resources"
							class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium {isResources
								? 'border-green-500 text-gray-900 dark:text-white'
								: 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300'}"
						>
							Resources
						</a>
						<a
							href="/games"
							class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium {isGames
								? 'border-green-500 text-gray-900 dark:text-white'
								: 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300'}"
						>
							Games
						</a>
					{/if}
				</div>
			</div>
			<div class="hidden sm:ml-6 sm:flex sm:items-center">
				{#if isUserLoggedIn}
					<a
						href="/logout"
						class="ml-3 inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:bg-green-500 dark:hover:bg-green-600"
					>
						Sign Out
					</a>
				{:else}
					<a
						href="/login"
						class="ml-3 inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:bg-green-500 dark:hover:bg-green-600"
					>
						Sign In
					</a>
				{/if}
				<button
					onclick={() => (isMenuOpen = !isMenuOpen)}
					class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 dark:hover:bg-gray-700 sm:hidden"
				>
					<span class="sr-only">Open main menu</span>
					<svg
						class="h-6 w-6"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
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
			<div class="-mr-2 flex items-center sm:hidden">
				<button
					onclick={() => (isMenuOpen = !isMenuOpen)}
					class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500 dark:hover:bg-gray-700"
				>
					<span class="sr-only">Open main menu</span>
					<svg
						class="h-6 w-6"
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

	{#if isMenuOpen}
		<div class="sm:hidden">
			<div class="space-y-1 pb-3 pt-2">
				<a
					href="/"
					class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium {isHome
						? 'border-green-500 text-green-700 dark:text-green-400 bg-green-50 dark:bg-gray-900'
						: 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300'}"
				>
					Home
				</a>
				<a
					href="/about"
					class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium {isAbout
						? 'border-green-500 text-green-700 dark:text-green-400 bg-green-50 dark:bg-gray-900'
						: 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300'}"
				>
					About
				</a>
				{#if isUserLoggedIn}
					<a
						href="/resources"
						class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium {isResources
							? 'border-green-500 text-green-700 dark:text-green-400 bg-green-50 dark:bg-gray-900'
							: 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300'}"
					>
						Resources
					</a>
					<a
						href="/games"
						class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium {isGames
							? 'border-green-500 text-green-700 dark:text-green-400 bg-green-50 dark:bg-gray-900'
							: 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300'}"
					>
						Games
					</a>
				{/if}
			</div>
			<div class="border-t border-gray-200 pb-3 pt-4 dark:border-gray-700">
				<div class="mt-3 space-y-1">
					{#if isUserLoggedIn}
						<a
							href="/logout"
							class="block w-full px-4 py-2 text-left text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
						>
							Sign Out
						</a>
					{:else}
						<a
							href="/login"
							class="block w-full px-4 py-2 text-left text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
						>
							Sign In
						</a>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</nav>
