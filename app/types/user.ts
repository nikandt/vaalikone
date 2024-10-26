export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    website: string;
    address: { street: string; city: string };
    answers: { questionId: number; answer: number }[];
  };
  