import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';

// Initialize Firebase Admin for server-side operations
const apps = getApps();

if (!apps.length) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    console.log("Initializing Firebase Admin with project: ", process.env.FIREBASE_PROJECT_ID);
    
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
  });
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error);
    throw error;
  }
}

const auth = getAuth();

export { auth as adminAuth };

// Create a type guard to check if auth is initialized
export function isAdminAuthInitialized(auth: Auth | undefined): auth is Auth {
  return auth !== undefined;
}