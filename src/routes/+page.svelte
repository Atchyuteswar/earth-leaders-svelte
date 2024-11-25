<script lang="ts">
	import { user } from '$lib/stores/authStore';
	import { onMount, setContext } from 'svelte';
	import { fade } from 'svelte/transition';

	const images = [
		{
			url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1574&q=80',
			alt: 'Beautiful forest landscape'
		},
		{
			url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1574&q=80',
			alt: 'Sunlight through forest canopy'
		},
		{
			url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1574&q=80',
			alt: 'Mountain lake reflection'
		}
	];

	let currentIndex = $state(0);
	let timer: NodeJS.Timeout;

	function nextImage() {
		currentIndex = (currentIndex + 1) % images.length;
	}

	function previousImage() {
		currentIndex = (currentIndex - 1 + images.length) % images.length;
	}

	let { data } = $props();

	onMount(() => {
		// Start auto-rotation
		timer = setInterval(nextImage, 5000);
		return () => {
			clearInterval(timer);
		};
	});

	let username = $state(data.user);

	$effect(() => {
		console.log('user:', username);
		setContext('user', username);
	});
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
	<!-- Hero Section -->
	<div class="relative overflow-hidden bg-white dark:bg-gray-800">
		<div class="mx-auto max-w-7xl">
			<div
				class="relative z-10 bg-white pb-8 dark:bg-gray-800 sm:pb-16 md:pb-20 lg:w-full lg:max-w-2xl lg:pb-28 xl:pb-32"
			>
				<main class="mx-auto mt-10 max-w-7xl px-4 sm:mt-12 sm:px-6 lg:mt-16 lg:px-8 xl:mt-20">
					<div class="sm:text-center lg:text-left">
						<h1
							class="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl"
						>
							<span class="block">Take action for</span>
							<span class="block text-green-600 dark:text-green-400">our planet's future</span>
						</h1>
						<p
							class="mt-3 text-base text-gray-500 dark:text-gray-300 sm:mx-auto sm:mt-5 sm:max-w-xl sm:text-lg md:mt-5 md:text-xl lg:mx-0"
						>
							Join our community of environmental leaders making a real difference. Together, we can
							create a sustainable future for generations to come.
						</p>
						<div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
							{#if $user}
								<div class="rounded-md shadow">
									<a
										href="/resources"
										class="flex w-full items-center justify-center rounded-md border border-transparent bg-green-600 px-8 py-3 text-base font-medium text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 md:px-10 md:py-4 md:text-lg"
									>
										View Resources
									</a>
								</div>
							{:else}
								<div class="text-sm text-gray-500 dark:text-gray-400">
									Sign in with Google to access our resources and join the community.
								</div>
							{/if}
						</div>
					</div>
				</main>
			</div>
		</div>
		<div class="relative lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
			<!-- Image carousel controls -->
			<button
				class="absolute left-4 top-1/2 z-20 -translate-y-1/2 transform rounded-full bg-white/80 p-2 text-gray-800 hover:bg-white dark:bg-gray-800/80 dark:text-white dark:hover:bg-gray-800"
				onclick={previousImage}
			>
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
						d="M15 19l-7-7 7-7"
					/>
				</svg>
			</button>
			<button
				class="absolute right-4 top-1/2 z-20 -translate-y-1/2 transform rounded-full bg-white/80 p-2 text-gray-800 hover:bg-white dark:bg-gray-800/80 dark:text-white dark:hover:bg-gray-800"
				onclick={nextImage}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</button>

			<!-- Image carousel -->
			{#each images as image, index}
				{#if index === currentIndex}
					<div in:fade={{ duration: 300 }} out:fade={{ duration: 300 }} class="absolute inset-0">
						<img
							class="h-56 w-full object-cover sm:h-72 md:h-96 lg:h-full lg:w-full"
							src={image.url}
							alt={image.alt}
						/>
						<!-- Image overlay gradient -->
						<div
							class="pointer-events-none absolute inset-0 bg-gradient-to-r from-white dark:from-gray-800 lg:from-transparent"
						></div>
					</div>
				{/if}
			{/each}

			<!-- Carousel indicators -->
			<div class="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 transform space-x-2">
				{#each images as _, index}
					<button
						class="w-2 h-2 rounded-full {index === currentIndex ? 'bg-white' : 'bg-white/50'}"
						onclick={() => (currentIndex = index)}
					></button>
				{/each}
			</div>
		</div>
	</div>

	<!-- Features Section -->
	<div class="bg-white py-12 dark:bg-gray-800">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="lg:text-center">
				<h2
					class="text-base font-semibold uppercase tracking-wide text-green-600 dark:text-green-400"
				>
					Our Mission
				</h2>
				<p
					class="mt-2 text-3xl font-extrabold leading-8 tracking-tight text-gray-900 dark:text-white sm:text-4xl"
				>
					Building a sustainable future
				</p>
				<p class="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-300 lg:mx-auto">
					We provide resources, tools, and a community to help environmental leaders make a real
					impact.
				</p>
			</div>

			<div class="mt-10">
				<div class="space-y-10 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10 md:space-y-0">
					<!-- Feature 1 -->
					<div class="relative">
						<div
							class="absolute flex h-12 w-12 items-center justify-center rounded-md bg-green-500 text-white dark:bg-green-400"
						>
							<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M12 6v6m0 0v6m0-6h6m-6 0H6"
								/>
							</svg>
						</div>
						<div class="ml-16">
							<h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
								Take Action
							</h3>
							<p class="mt-2 text-base text-gray-500 dark:text-gray-300">
								Find opportunities to make a difference in your community and beyond.
							</p>
						</div>
					</div>

					<!-- Feature 2 -->
					<div class="relative">
						<div
							class="absolute flex h-12 w-12 items-center justify-center rounded-md bg-green-500 text-white dark:bg-green-400"
						>
							<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
								/>
							</svg>
						</div>
						<div class="ml-16">
							<h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
								Join the Community
							</h3>
							<p class="mt-2 text-base text-gray-500 dark:text-gray-300">
								Connect with like-minded individuals committed to environmental change.
							</p>
						</div>
					</div>

					<!-- Feature 3 -->
					<div class="relative">
						<div
							class="absolute flex h-12 w-12 items-center justify-center rounded-md bg-green-500 text-white dark:bg-green-400"
						>
							<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
								/>
							</svg>
						</div>
						<div class="ml-16">
							<h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">Learn</h3>
							<p class="mt-2 text-base text-gray-500 dark:text-gray-300">
								Access educational resources and stay informed about environmental issues.
							</p>
						</div>
					</div>

					<!-- Feature 4 -->
					<div class="relative">
						<div
							class="absolute flex h-12 w-12 items-center justify-center rounded-md bg-green-500 text-white dark:bg-green-400"
						>
							<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 10V3L4 14h7v7l9-11h-7z"
								/>
							</svg>
						</div>
						<div class="ml-16">
							<h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
								Make an Impact
							</h3>
							<p class="mt-2 text-base text-gray-500 dark:text-gray-300">
								Track your environmental impact and inspire others to join the cause.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
