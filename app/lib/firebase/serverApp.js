import 'server-only';

import { firebaseConfig } from './config';
import { initializeServerApp } from 'firebase/app';
import { headers } from 'next/headers';

import { getAuth } from 'firebase/auth';

export async function getAuthenticatedAppForUser() {
  const idToken = headers().get('Authorization')?.split('Bearer ')[1];

  const firebaseServerApp = initializeServerApp(
    firebaseConfig,
    idToken
      ? {
          authIdToken: idToken,
        }
      : {},
  );

  const auth = getAuth(firebaseServerApp);
  await auth.authStateReady();

  return { firebaseServerApp, currentUser: auth.currentUser };
}
