import PocketBase from 'pocketbase';

// Establishing the singleton connection for real-time storage
const url = import.meta.env.VITE_POCKETBASE_URL;
export const pb = new PocketBase(url);