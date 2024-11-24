<script lang="ts">
  import { user } from '$lib/stores/authStore';
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';

  interface Action {
    id: string;
    title: string;
    description: string;
    impact: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    category: 'Personal' | 'Community' | 'Global';
    icon: string;
    resources: { title: string; url: string }[];
  }

  const actions: Action[] = [
    {
      id: 'reduce-waste',
      title: 'Zero Waste Challenge',
      description: 'Reduce your household waste by implementing zero-waste practices in your daily life.',
      impact: 'Reduce landfill waste and plastic pollution',
      difficulty: 'Medium',
      category: 'Personal',
      icon: 'M4 4v2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v2m3-3h6M7 16l3-3m0 0l3 3',
      resources: [
        { title: 'Zero Waste Beginner Guide', url: 'https://www.goingzerowaste.com/blog/beginners-guide/' },
        { title: 'Plastic Free Living Tips', url: 'https://www.plasticfreejuly.org/get-involved/what-you-can-do/' }
      ]
    },
    {
      id: 'community-garden',
      title: 'Start Community Garden',
      description: 'Create or join a community garden to promote local food production and community engagement.',
      impact: 'Promote sustainable food systems and community bonds',
      difficulty: 'Hard',
      category: 'Community',
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      resources: [
        { title: 'Community Garden Planning', url: 'https://www.communitygarden.org/resources' },
        { title: 'Urban Farming Guide', url: 'https://www.urbanfarming.org/'}
      ]
    },
    {
      id: 'renewable-energy',
      title: 'Switch to Renewable Energy',
      description: 'Transition your home to renewable energy sources or support renewable energy initiatives.',
      impact: 'Reduce carbon emissions and support clean energy',
      difficulty: 'Medium',
      category: 'Personal',
      icon: 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z',
      resources: [
        { title: 'Home Solar Guide', url: 'https://www.energy.gov/energysaver/planning-home-solar-electric-system' },
        { title: 'Energy Efficiency Tips', url: 'https://www.energy.gov/energysaver/energy-saver-guide-tips-saving-money-and-energy-home' }
      ]
    },
    {
      id: 'climate-advocacy',
      title: 'Climate Action Advocacy',
      description: 'Engage in climate advocacy by contacting representatives and joining climate action groups.',
      impact: 'Influence policy changes and raise awareness',
      difficulty: 'Medium',
      category: 'Global',
      icon: 'M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9',
      resources: [
        { title: 'Climate Action Network', url: 'https://climatenetwork.org/get-involved/' },
        { title: 'Environmental Advocacy Guide', url: 'https://www.epa.gov/environmentaljustice' }
      ]
    }
  ];

  let selectedCategory: string = 'all';
  let searchQuery: string = '';
  let completedActions: Set<string> = new Set();

  $: filteredActions = actions.filter(action => {
    const matchesCategory = selectedCategory === 'all' || action.category === selectedCategory;
    const matchesSearch = action.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         action.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  function toggleActionComplete(actionId: string) {
    if (completedActions.has(actionId)) {
      completedActions.delete(actionId);
    } else {
      completedActions.add(actionId);
    }
    completedActions = completedActions; // Trigger reactivity
  }

  function getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return '';
    }
  }

  function getCategoryColor(category: string): string {
    switch (category) {
      case 'Personal': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Community': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'Global': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300';
      default: return '';
    }
  }
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center">
      <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
        Environmental Action Resources
      </h1>
      <p class="mt-3 mb-6 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-300 sm:mt-4">
        Take meaningful action for our planet with these curated resources and initiatives.
      </p>
    </div>

    <!-- Filters -->
    <div class="mt-8 mb-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
      <div class="flex space-x-4">
        <button
          class="px-4 py-2 rounded-md {selectedCategory === 'all' ? 'bg-green-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'} hover:bg-green-500 hover:text-white transition-colors"
          on:click={() => selectedCategory = 'all'}
        >
          All
        </button>
        <button
          class="px-4 py-2 rounded-md {selectedCategory === 'Personal' ? 'bg-green-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'} hover:bg-green-500 hover:text-white transition-colors"
          on:click={() => selectedCategory = 'Personal'}
        >
          Personal
        </button>
        <button
          class="px-4 py-2 rounded-md {selectedCategory === 'Community' ? 'bg-green-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'} hover:bg-green-500 hover:text-white transition-colors"
          on:click={() => selectedCategory = 'Community'}
        >
          Community
        </button>
        <button
          class="px-4 py-2 rounded-md {selectedCategory === 'Global' ? 'bg-green-600 text-white' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'} hover:bg-green-500 hover:text-white transition-colors"
          on:click={() => selectedCategory = 'Global'}
        >
          Global
        </button>
      </div>
      <div class="w-full sm:w-64">
        <input
          type="text"
          placeholder="Search actions..."
          bind:value={searchQuery}
          class="w-full mt-4 sm:mt-0 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>
    </div>

    <!-- Action Cards -->
    <div class="mt-12 mb-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {#each filteredActions as action (action.id)}
        <div
          in:fade={{ duration: 200 }}
          class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden transform transition-all hover:scale-105"
        >
          <div class="p-6">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="flex items-center justify-between">
                  <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(action.difficulty)}`}>
                    {action.difficulty}
                  </span>
                  <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(action.category)}`}>
                    {action.category}
                  </span>
                </div>
                <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">{action.title}</h3>
                <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">{action.description}</p>
                <p class="mt-3 text-sm font-medium text-green-600 dark:text-green-400">Impact: {action.impact}</p>
              </div>
            </div>

            <!-- Resources -->
            <div class="mt-4">
              <h4 class="text-sm font-medium text-gray-900 dark:text-white">Resources:</h4>
              <ul class="mt-2 space-y-2">
                {#each action.resources as resource}
                  <li>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-sm text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300"
                    >
                      {resource.title} →
                    </a>
                  </li>
                {/each}
              </ul>
            </div>

            <!-- Action Button -->
            <button
              on:click={() => toggleActionComplete(action.id)}
              class="mt-6 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white {completedActions.has(action.id) ? 'bg-gray-600 dark:bg-gray-700' : 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {#if completedActions.has(action.id)}
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Completed
              {:else}
                Take Action
              {/if}
            </button>
          </div>
        </div>
      {/each}
    </div>

    <!-- Progress Section -->
    <div class="mt-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Your Progress</h2>
      <div class="mt-4">
        <div class="relative pt-1">
          <div class="flex mb-2 items-center justify-between">
            <div>
              <span class="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 dark:text-green-400 bg-green-200 dark:bg-green-900">
                Progress
              </span>
            </div>
            <div class="text-right">
              <span class="text-xs font-semibold inline-block text-green-600 dark:text-green-400">
                {Math.round((completedActions.size / actions.length) * 100)}%
              </span>
            </div>
          </div>
          <div class="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200 dark:bg-green-900">
            <div
              style="width: {(completedActions.size / actions.length) * 100}%"
              class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500 dark:bg-green-400 transition-all duration-500"
            ></div>
          </div>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          You've completed {completedActions.size} out of {actions.length} environmental actions.
          {#if completedActions.size === 0}
            Start your journey by taking your first action!
          {:else if completedActions.size === actions.length}
            Amazing work! You've completed all available actions!
          {:else}
            Keep going, you're making a difference!
          {/if}
        </p>
      </div>
    </div>
  </div>
</div>
