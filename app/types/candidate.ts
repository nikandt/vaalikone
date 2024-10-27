export interface Candidate {
  id: string | number;
  answers: { questionId: number; answer: number; customText?: string }[];
}
