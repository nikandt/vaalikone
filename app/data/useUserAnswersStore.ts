import { create } from 'zustand';

interface Answer {
  questionId: number;
  answer: number;
  customText?: string;
}

interface Match {
  secondAnswererId: number | string;
  percentage: number;
  distance: number;
}

interface UserAnswersStore {
  answers: Answer[];
  matches: Match[]; 
  setAnswer: (answer: Answer) => void;
  updateCustomText: (questionId: number, text: string) => void;
  setMatches: (matches: Match[]) => void; 
  resetAnswers: () => void;
}

export const useUserAnswersStore = create<UserAnswersStore>((set) => ({
  answers: [],
  matches: [],

  setAnswer: (newAnswer) =>
    set((state) => {
      const updatedAnswers = state.answers.filter(
        (answer) => answer.questionId !== newAnswer.questionId,
      );
      return { answers: [...updatedAnswers, newAnswer] };
    }),

  updateCustomText: (questionId, text) =>
    set((state) => {
      const answerIndex = state.answers.findIndex(
        (a) => a.questionId === questionId,
      );
      if (answerIndex !== -1) {
        state.answers[answerIndex].customText = text;
      }
      return { answers: [...state.answers] };
    }),

  setMatches: (newMatches) => set({ matches: newMatches }), 

  resetAnswers: () => set({ answers: [], matches: [] }), 
}));