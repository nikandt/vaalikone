import { useState, useEffect } from 'react';
import { sampleAnswersList } from './answers';

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  address: { street: string; city: string };
  answers: { questionId: number; answer: number }[];
};

const assignAnswersToUser = (user: User, index: number): User => {
    const answers = sampleAnswersList[index % sampleAnswersList.length];
    return { ...user, answers };
  };

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => response.json())
      .then((data) => {
        const usersWithAnswers = data.map((user: User) => assignAnswersToUser(user));
        setUsers(usersWithAnswers);
        setLoading(false);
      });
  }, []);

  const totalUsers = users.length;

  return { users, loading, totalUsers };
};
