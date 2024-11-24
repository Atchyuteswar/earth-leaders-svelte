<script lang="ts">
  import CarbonFootprint from '$lib/components/games/CarbonFootprint.svelte';
  import ChocolateQuiz from '$lib/components/games/ChocolateQuiz.svelte';
  import { fade } from 'svelte/transition';

  let selectedGame: string | null = null;
</script>

<div class="min-h-screen p-6 bg-white dark:bg-gray-900">
  <div class="max-w-7xl mx-auto">
    <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-8">Environmental Games</h1>
    
    {#if !selectedGame}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6" in:fade>
        <!-- Carbon Footprint Game Card -->
        <button 
          class="p-6 bg-green-50 dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all"
          on:click={() => selectedGame = 'carbon'}
        >
          <h2 class="text-2xl font-semibold text-green-700 dark:text-green-400 mb-3">Carbon Footprint Calculator</h2>
          <p class="text-gray-600 dark:text-gray-300">Calculate your carbon footprint and learn how to reduce it through an interactive game!</p>
        </button>

        <!-- Chocolate Quiz Card -->
        <button 
          class="p-6 bg-yellow-50 dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all"
          on:click={() => selectedGame = 'chocolate'}
        >
          <h2 class="text-2xl font-semibold text-yellow-700 dark:text-yellow-400 mb-3">Chocolate Impact Quiz</h2>
          <p class="text-gray-600 dark:text-gray-300">Test your knowledge about chocolate's environmental impact and sustainable practices!</p>
        </button>
      </div>
    {:else}
      <button 
        class="mb-6 flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        on:click={() => selectedGame = null}
      >
        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Games
      </button>

      {#if selectedGame === 'carbon'}
        <CarbonFootprint />
      {:else if selectedGame === 'chocolate'}
        <ChocolateQuiz />
      {/if}
    {/if}
  </div>
</div>
