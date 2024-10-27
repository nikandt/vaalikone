import { User } from '../types/user';
import { useEffect, useState } from 'react';

import { fetchUsersWithAnswers } from '../lib/firebase/firestore';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      const fetchedUsers = await fetchUsersWithAnswers();
      setUsers(fetchedUsers);
      setLoading(false);
    };

    loadUsers();
  }, []);

  const totalUsers = users.length;

  return { users, loading, totalUsers };
};