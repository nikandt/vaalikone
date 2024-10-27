import { db } from './clientApp';

import { getAuth } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

export async function saveQuestionnaireAnswers(answers) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    console.error('User not authenticated');
    return;
  }

  const userDocRef = doc(db, 'questionnaire_answers', user.uid);

  try {
    await setDoc(userDocRef, {
      answers,
      timestamp: serverTimestamp(), // Adds a timestamp to the document
    });
    console.log('Answers successfully saved with a timestamp to Firestore!');
  } catch (error) {
    console.error('Error saving answers:', error);
  }
}
