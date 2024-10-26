import { create } from 'zustand';

interface Answer {
  questionId: number;
  answer: number;
}

interface UserAnswersStore {
  answers: Answer[];
  setAnswer: (answer: Answer) => void;
  resetAnswers: () => void;
}

export const useUserAnswersStore = create<UserAnswersStore>((set) => ({
  answers: [],

  setAnswer: (newAnswer) =>
    set((state) => {
      const updatedAnswers = state.answers.filter(
        (answer) => answer.questionId !== newAnswer.questionId
      );
      return { answers: [...updatedAnswers, newAnswer] };
    }),

  resetAnswers: () => set({ answers: [] }),
}));
