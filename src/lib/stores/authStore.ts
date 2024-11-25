import { writable } from 'svelte/store';
import type { User } from 'firebase/auth';

export const user = writable();
export const loading = writable(true);
export const initialized = writable(false);
