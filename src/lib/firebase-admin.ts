import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';

// Declare types for our admin instances
let adminApp: App;
let adminAuth: Auth | undefined;

// Only initialize on server side
if (typeof window === 'undefined') {
  if (!getApps().length) {
    adminApp = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
  adminAuth = getAuth();
}

// Create a type guard to check if adminAuth is initialized
export function isAdminAuthInitialized(auth: Auth | undefined): auth is Auth {
  return auth !== undefined;
}

export { adminAuth };