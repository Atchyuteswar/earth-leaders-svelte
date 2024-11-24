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

<nav class="bg-white shadow-lg">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between h-16">
      <div class="flex">
        <div class="flex-shrink-0 flex items-center">
          <a href="/" class="text-xl font-bold text-green-700">Earth Leaders</a>
        </div>
        <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
          <a
            href="/"
            class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium {isHome ? 'border-green-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
          >
            Home
          </a>
          <a
            href="/about"
            class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium {isAbout ? 'border-green-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
          >
            About
          </a>
          <a
            href="/resources"
            class="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium {isResources ? 'border-green-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}"
          >
            Resources
          </a>
        </div>
      </div>

      <div class="hidden sm:ml-6 sm:flex sm:items-center">
        {#if $user}
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-700">Welcome, {$user.email}</span>
            <button
              on:click={handleSignOut}
              disabled={loading}
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {loading ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        {:else}
          <button
            on:click={handleSignIn}
            disabled={loading}
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {#if loading}
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            {:else}
              Sign in with Google
            {/if}
          </button>
        {/if}
      </div>

      <!-- Mobile menu button -->
      <div class="flex items-center sm:hidden">
        <button
          on:click={() => (isMenuOpen = !isMenuOpen)}
          class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
        >
          <span class="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
          <svg
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            {#if isMenuOpen}
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            {:else}
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            {/if}
          </svg>
        </button>
      </div>
    </div>
  </div>

  <!-- Mobile menu -->
  {#if isMenuOpen}
    <div class="sm:hidden">
      <div class="pt-2 pb-3 space-y-1">
        <a
          href="/"
          class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium {isHome ? 'bg-green-50 border-green-500 text-green-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'}"
        >
          Home
        </a>
        <a
          href="/about"
          class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium {isAbout ? 'bg-green-50 border-green-500 text-green-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'}"
        >
          About
        </a>
        <a
          href="/resources"
          class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium {isResources ? 'bg-green-50 border-green-500 text-green-700' : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'}"
        >
          Resources
        </a>
      </div>
      <div class="pt-4 pb-3 border-t border-gray-200">
        {#if $user}
          <div class="flex items-center px-4">
            <div class="flex-shrink-0">
              <span class="text-sm text-gray-700">Welcome, {$user.email}</span>
            </div>
          </div>
          <div class="mt-3 space-y-1">
            <button
              on:click={handleSignOut}
              disabled={loading}
              class="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 disabled:opacity-50"
            >
              {loading ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        {:else}
          <div class="mt-3 space-y-1">
            <button
              on:click={handleSignIn}
              disabled={loading}
              class="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in with Google'}
            </button>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</nav>
