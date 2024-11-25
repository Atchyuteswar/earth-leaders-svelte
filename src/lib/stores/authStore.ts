import { writable } from 'svelte/store';

type User = {
    id: string;
    email: string;
    username: string;
    googleId?: string;
};

export const user = writable<User | null>();
export const loading = writable(true);
export const initialized = writable(false);
