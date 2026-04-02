// Import the standalone browser-safe Buffer implementation
import { Buffer } from 'buffer';

// Explicitly bind Buffer to the browser's global scopes
window.Buffer = Buffer;
globalThis.Buffer = Buffer;

// Explicitly map the Node.js 'global' object to the browser's 'window'
// This prevents legacy cryptography modules from crashing on mobile/production
window.global = window;