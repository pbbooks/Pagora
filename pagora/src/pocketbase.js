import PocketBase from 'pocketbase';

// 1. Establishing the singleton connection for real-time storage
const url = import.meta.env.VITE_POCKETBASE_URL;
export const pb = new PocketBase(url);

// 2. Strict Superuser Authentication Logic
/**
 * Authenticates the admin portal using the strict superuser credentials
 * injected via the CLI. This grants the dashboard global CRUD access
 * to instantly manage books and users for pbpagora.web.app.
 */
export const authenticateSuperuser = async () => {
  try {
    // Note: PocketBase v0.20+ requires targeting the '_superusers' collection
    // for admin accounts created via the CLI `superuser upsert` command.
    const authData = await pb.collection('_superusers').authWithPassword(
      'testcodecfg@gmail.com',
      'Soc@0099@#$_&'
    );
    return authData;
  } catch (error) {
    console.error('CRITICAL: Superuser database authentication failed.', error);
    throw error;
  }
};

// 3. Session Management Logic
/**
 * Destroys the superuser token and completely severs the database connection
 * when the admin explicitly logs out of the portal.
 */
export const logoutSuperuser = () => {
  pb.authStore.clear();
};