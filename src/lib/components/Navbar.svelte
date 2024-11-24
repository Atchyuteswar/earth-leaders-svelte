<script lang="ts">
  import { auth, googleProvider } from '$lib/firebase';
  import { signInWithPopup, signOut } from 'firebase/auth';
  import { user } from '$lib/stores/authStore';
  import { page } from '$app/stores';

  let isMenuOpen = false;
  let loading = false;

  async function handleSignIn() {
    if (!auth || !googleProvider) return;
    loading = true;

    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Sign in error:', error);
    } finally {
      loading = false;
    }
  }

  async function handleSignOut() {
    if (!auth) return;
    loading = true;

    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      loading = false;
    }
  }

  $: isHome = $page.url.pathname === '/';
  $: isAbout = $page.url.pathname === '/about';
  $: isResources = $page.url.pathname === '/resources';
</script>

<nav class="bg-white dark:bg-gray-800 shadow-lg">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16">
      <div class="flex">
        <div class="flex-shrink-0 flex items-center">
          <a href="/" class="text-xl font-bold text-green-700 dark:text-green-400">Earth Leaders</a>
        </div>
        <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
          <a
            href="/"
            class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium {isHome ? 'border-green-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300'}"
          >
            Home
          </a>
          <a
            href="/about"
            class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium {isAbout ? 'border-green-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300'}"
          >
            About
          </a>
          {#if $user}
            <a
              href="/resources"
              class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium {isResources ? 'border-green-500 text-gray-900 dark:text-white' : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300'}"
            >
              Resources
            </a>
          {/if}
        </div>
      </div>
      <div class="hidden sm:ml-6 sm:flex sm:items-center">
        {#if $user}
          <button
            on:click={handleSignOut}
            class="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            disabled={loading}
          >
            Sign Out
          </button>
        {:else}
          <button
            on:click={handleSignIn}
            class="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            disabled={loading}
          >
            Sign In with Google
          </button>
        {/if}
      </div>
      <div class="-mr-2 flex items-center sm:hidden">
        <button
          on:click={() => (isMenuOpen = !isMenuOpen)}
          class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
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
      <div class="pt-2 pb-3 space-y-1">
        <a
          href="/"
          class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium {isHome ? 'border-green-500 text-green-700 dark:text-green-400 bg-green-50 dark:bg-gray-900' : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300'}"
        >
          Home
        </a>
        <a
          href="/about"
          class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium {isAbout ? 'border-green-500 text-green-700 dark:text-green-400 bg-green-50 dark:bg-gray-900' : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300'}"
        >
          About
        </a>
        {#if $user}
          <a
            href="/resources"
            class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium {isResources ? 'border-green-500 text-green-700 dark:text-green-400 bg-green-50 dark:bg-gray-900' : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 hover:text-gray-700 dark:hover:text-gray-300'}"
          >
            Resources
          </a>
        {/if}
      </div>
      <div class="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
        <div class="mt-3 space-y-1">
          {#if $user}
            <button
              on:click={handleSignOut}
              class="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              disabled={loading}
            >
              Sign Out
            </button>
          {:else}
            <button
              on:click={handleSignIn}
              class="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              disabled={loading}
            >
              Sign In with Google
            </button>
          {/if}
        </div>
      </div>
    </div>
  {/if}
</nav>
