import { useState, useEffect } from 'react';
import styles from '../styles/Vieraat.module.scss';
import { FaSearch } from 'react-icons/fa';
import { Button, Card, CardContent, Typography, Container } from '@mui/material';

import { User } from '../types';

import { useUsers } from '../data/users';
//import { useUserAnswersStore } from '../data/useUserAnswersStore';

const Vieraat: React.FC = () => {
  const { users: users, loading } = useUsers();
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'email'>('name');
  const [isAscending, setIsAscending] = useState(true);

  useEffect(() => {
    let updatedUsers = users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    updatedUsers = updatedUsers.sort((a, b) => {
      let compare;
      if (sortBy === 'name') {
        const lastNameA = getLastName(a.name).toLowerCase();
        const lastNameB = getLastName(b.name).toLowerCase();
        compare = lastNameA.localeCompare(lastNameB);
      } else {
        compare = a.email.localeCompare(b.email);
      }
      return isAscending ? compare : -compare;
    });

    setFilteredUsers(updatedUsers);
  }, [users, searchTerm, sortBy, isAscending]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredUsers(
      users.filter((user) =>
        user.name.toLowerCase().includes(term)
      )
    );
  };

  const getLastName = (name: string) => {
    const parts = name.split(' ');
    return parts[parts.length - 1]; // Assume last word is the last name
  };

  const handleSort = (field: 'name' | 'email') => {
    const sortedUsers = [...filteredUsers].sort((a, b) => {
      let compare;
      if (field === 'name') {
        const lastNameA = getLastName(a.name).toLowerCase();
        const lastNameB = getLastName(b.name).toLowerCase();
        compare = lastNameA.localeCompare(lastNameB);
      } else {
        compare = a.email.localeCompare(b.email);
      }
      return isAscending ? compare : -compare;
    });
    setSortBy(field);
    setIsAscending(!isAscending);
    setFilteredUsers(sortedUsers);
  };

  if (loading) {
    return <p>Loading users...</p>;
  }

  return (
    <Container maxWidth="md" className={styles.users}>
      <h1>Vieraat</h1>
      <div className={styles.controls}>
        <div className={styles.searchBar}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className={styles.sortBy}>
          <p>Lajittele:</p>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSort('name')}
          >
            Nimi {isAscending && sortBy === 'name' ? '▲' : '▼'}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleSort('email')}
          >
            Sähköposti {isAscending && sortBy === 'email' ? '▲' : '▼'}
          </Button>
        </div>
      </div>
      <div className={styles.userList}>
        {filteredUsers.map((user) => (
          <Card className={styles.userCard} key={user.id}>
            <CardContent>
              <Typography variant="h5">{user.name}</Typography>
              <Typography variant="body2">
                <strong>Sähköposti:</strong> {user.email}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </Container>
  );
};

export default Vieraat;
