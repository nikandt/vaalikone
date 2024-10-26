import { useState, useEffect } from 'react';
import { sampleAnswersList } from './answers';
import { User } from '../types';

const assignAnswersToUser = (user: User, index: number): User => {
    const answers = sampleAnswersList[index % sampleAnswersList.length] || [];
    return { ...user, answers };
  };

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => response.json())
      .then((data) => {
        const usersWithAnswers = data.map((user: User, index: number) => assignAnswersToUser(user, index));
        setUsers(usersWithAnswers);
        setLoading(false);
      });
  }, []);

  const totalUsers = users.length;

  return { users, loading, totalUsers };
};
