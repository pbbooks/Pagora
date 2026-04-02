// ============================================================================
// PAGORA ADMIN PORTAL - REAL-TIME FIREBASE SECURITY & INFRASTRUCTURE ENGINE
// ============================================================================

// SECTION 1: Core Firebase Application Engine Import
// Essential for bootstrapping the underlying real-time network connection.
import { initializeApp } from "firebase/app";

// SECTION 2: Identity & Access Management Module
// Strictly imports the Auth SDK and SSO Providers (Google/Apple) for the dual-layer superuser login gate.
import { getAuth, GoogleAuthProvider, OAuthProvider } from "firebase/auth";

// SECTION 3: Live Document Storage Architecture
// Imports Firestore for potential real-time configuration syncing in the admin layer.
import { getFirestore } from "firebase/firestore";

// SECTION 4: Real-Time Telemetry & Analytics Tracker
// Tracks active admin sessions and interaction metrics in production.
import { getAnalytics } from "firebase/analytics";

// SECTION 5: Core Security & Domain Binding
// Pulls strict production API keys and Auth domains from the hardened environment file.
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const authDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN;

// SECTION 6: Project Infrastructure & Bucket Mapping
// Maps the exact Google Cloud project and storage bucket allocations.
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
const storageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET;

// SECTION 7: Application Telemetry Configuration Matrix
// Compiles the specific web application IDs and parameters into the final payload.
const firebaseConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// SECTION 8: Singleton Application Initialization
// Bootstraps the live Firebase instance into application memory.
const app = initializeApp(firebaseConfig);

// SECTION 9: Authentication, Providers & Database Payload Exports
// Exposes the locked-down Auth instance, SSO providers, and DB for the Admin Portal components.
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider('apple.com');
export const db = getFirestore(app);

// SECTION 10: Environment-Aware Analytics Initialization
// Strictly checks for the browser window object to prevent Server-Side Rendering (SSR) crashes.
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;