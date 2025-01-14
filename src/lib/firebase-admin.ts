// src/lib/firebase-admin.ts
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';

const apps = getApps();

if (!apps.length) {
  try {
    // Debug environment variables
    const envCheck = {
      projectId: process.env.FIREBASE_PROJECT_ID === 'kinderguardian-51c2d',
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL === 'firebase-adminsdk-suap4@kinderguardian-51c2d.iam.gserviceaccount.com',
      privateKeyLength: process.env.FIREBASE_PRIVATE_KEY?.length,
      privateKeyStart: process.env.FIREBASE_PRIVATE_KEY?.substring(0, 50)
    };
    console.log("Firebase Admin Environment Check:", envCheck);

    // Create cert config first to validate it
    const certConfig = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    };
    console.log("Cert Config (without private key):", {
      projectId: certConfig.projectId,
      clientEmail: certConfig.clientEmail,
      privateKeyPresent: !!certConfig.privateKey
    });

    // Initialize app with validated cert
    const credential = cert(certConfig);
    initializeApp({ credential });
    console.log("Firebase Admin initialized successfully");

  } catch (error) {
    console.error("Firebase Admin initialization error:", {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}

const auth = getAuth();
export { auth as adminAuth };

export function isAdminAuthInitialized(auth: Auth | undefined): auth is Auth {
  return auth !== undefined;
}