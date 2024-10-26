import { db } from "./clientApp";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";

//const db = getFirestore();

export async function saveQuestionnaireAnswers(answers) {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (user) {
    try {
      await addDoc(collection(db, "questionnaire_answers"), {
        userId: user.uid,
        answers: answers,
        timestamp: serverTimestamp()
      });
      console.log("Answers saved successfully");
    } catch (error) {
      console.error("Error saving answers: ", error);
    }
  } else {
    console.log("User is not authenticated");
  }
}