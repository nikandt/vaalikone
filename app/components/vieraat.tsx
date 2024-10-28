import styles from '../styles/Vieraat.module.scss';
import { User } from '../types/user';
import { useUsers } from '../data/users';
import { auth } from '../lib/firebase/clientApp';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';


import { useUserAnswersStore } from '../data/useUserAnswersStore';
import { fetchUserMatch } from '../lib/firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface Match {
  percentage: number;
  secondAnswererId: string;
  distance: number;
}

interface ExtraMatchData {
  matches: Match[];
  timestamp?: {
    seconds: number;
    nanoseconds: number;
  };
}

const Vieraat: React.FC = () => {
  const { users: users, loading } = useUsers();
  const { matches } = useUserAnswersStore();

  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'email'>('name');
  const [isAscending, setIsAscending] = useState(true);

  //const currentUser = auth.currentUser;
  const [userId, setUserId] = useState<string | null>(null);
  const [extraMatchData, setExtraMatchData] = useState<{ [key: string]: ExtraMatchData }>({});


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);


  const getMatchData = async () => {
    if (userId && !extraMatchData[userId]) {
      const fetchedMatch = await fetchUserMatch(userId);
      console.log(`Fetched match data for user ${userId}:`, fetchedMatch);
      if (fetchedMatch) {
        setExtraMatchData((prevData) => ({
          ...prevData,
          [userId]: fetchedMatch as ExtraMatchData, // Explicitly cast fetchedMatch
        }));
      }
    }
  };

  useEffect(() => {
    if (userId) {
      getMatchData();
    }
  }, [userId]);

  useEffect(() => {
    let updatedUsers = users.filter((user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()),
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
      users.filter((user) => user.name.toLowerCase().includes(term)),
    );
  };

  const getLastName = (name: string) => {
    const parts = name.split(' ');
    return parts[parts.length - 1];
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
      {filteredUsers.map((user) => {
      const match = matches?.find((m) => m.secondAnswererId === user.id);

      const dbMatchArray = extraMatchData[userId]?.matches;
      const dbMatch = dbMatchArray ? dbMatchArray.find(
        (m) => m.secondAnswererId === user.id,
      ) : null;

      if (!match && !extraMatchData[user.id]) getMatchData();

      return (
        <Card className={styles.userCard} key={user.id}>
          <CardContent>
            <Typography variant="h5">{user.name}</Typography>
            <Typography variant="body2">
              <strong>Sähköposti:</strong> {user.email}
            </Typography>

            {match || dbMatch ? (

              
            <Box position="relative" display="inline-flex" alignItems="center">
              
              <CircularProgress
                variant="determinate"
                value={((match || dbMatch).percentage || 0) * 100}
                size={80}
                thickness={5}
              />
              <Box
                position="absolute"
                top="50%"
                left="50%"
                style={{
                  transform: "translate(-50%, -50%)",
                }}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Typography variant="caption" component="div" color="textSecondary">
                  {((match || dbMatch).percentage * 100).toFixed(1)}%
                </Typography>
              </Box>                  
            </Box>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No match data available
              </Typography>
            )}
          </CardContent>
        </Card>
      );
    })}

      </div>
    </Container>
  );
};

export default Vieraat;
