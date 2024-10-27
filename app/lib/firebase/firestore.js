import { db } from './clientApp';

import { getAuth } from 'firebase/auth';
import { doc, serverTimestamp, setDoc, collection, getDocs, getDoc } from 'firebase/firestore';

export async function saveQuestionnaireAnswers(answers) {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    console.error('User not authenticated');
    return;
  }
  const userDocRef = doc(db, 'users', user.uid);
  const answersRef = collection(userDocRef, 'questionnaire_answers');

  try {
    const answerDocRef = doc(answersRef, "latest");
    await setDoc(answerDocRef, {
      answers,
      timestamp: serverTimestamp(),
    });

    console.log('Answers successfully saved with a timestamp to Firestore!');
  } catch (error) {
    console.error('Error saving answers:', error);
  }
}

export async function fetchUsersWithAnswers() {
  const usersCollection = collection(db, 'users');
  const usersSnapshot = await getDocs(usersCollection);
  
  const users = await Promise.all(usersSnapshot.docs.map(async (doc) => {
    const userData = doc.data();
    const answersCollection = collection(doc.ref, 'questionnaire_answers');
    const answersSnapshot = await getDocs(answersCollection);

    const latestAnswersDoc = answersSnapshot.docs.find(answerDoc => answerDoc.id === 'latest');
    const answers = latestAnswersDoc ? latestAnswersDoc.data().answers : [];

    return { 
      id: doc.id, 
      name: userData.name, 
      email: userData.email, 
      phone: userData.phone, 
      website: userData.website, 
      address: userData.address,
      company: userData.company,
      username: userData.username,
      answers
    };
  }));

  return users;
}

// NOTE: Only run this ONCE! Saves mock user data
/*
export async function saveMockUsersAndAnswers(mockUsers) {
  try {
    for (const user of mockUsers) {
      const userDocRef = doc(db, 'users', `mock_${user.id}`); // Using 'mock_' prefix for uniqueness

      await setDoc(userDocRef, {
        name: user.name,
        email: user.email,
        address: user.address,
        company: user.company,
        username: user.username,
        phone: user.phone,
        website: user.website
      });

      const answersRef = collection(userDocRef, 'questionnaire_answers');

      const answerDocRef = doc(answersRef, "latest"); // Using "latest" for consistent structure
      await setDoc(answerDocRef, {
        answers: user.answers, 
        timestamp: serverTimestamp(),
      });
    }
    console.log("Mock users and answers successfully saved!");
  } catch (error) {
    console.error("Error saving mock users and answers:", error);
  }
}*/

export async function fetchQuestionSet(questionSetId) {
  const questionSetDocRef = doc(db, 'question_sets', questionSetId);

  try {
    const questionSetSnapshot = await getDoc(questionSetDocRef);
    if (questionSetSnapshot.exists()) {
      return questionSetSnapshot.data();
    } else {
      console.log("No such question set found");
      return null;
    }
  } catch (error) {
    console.error("Error fetching question set:", error);
    return null;
  }
}