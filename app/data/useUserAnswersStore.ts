import { create } from 'zustand';

interface Answer {
  questionId: number;
  answer: number;
  customText?: string;
}

interface UserAnswersStore {
  answers: Answer[];
  setAnswer: (answer: Answer) => void;
  updateCustomText: (questionId: number, text: string) => void;
  resetAnswers: () => void;
}

export const useUserAnswersStore = create<UserAnswersStore>((set) => ({
  answers: [],

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

  resetAnswers: () => set({ answers: [] }),
}));
