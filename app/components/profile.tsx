import { useRouter } from 'next/router'; // Adjust if using a different routing setup
import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Button, Link } from '@mui/material';
import { useUsers } from '../data/users'; // Ensure this hook fetches user data based on ID

const Profile = () => {
  const router = useRouter();
  const { id } = router.query; // Fetch the user ID from the URL
  const { users } = useUsers(); // Fetch all users

  // State to hold user details
  const [user, setUser] = useState(null);

  // Fetch the current user based on the ID from URL
  useEffect(() => {
    if (id) {
      const matchedUser = users.find((u) => u.id === id);
      setUser(matchedUser);
    }
  }, [id, users]);

  // Redirect if user not found
  if (!user) {
    return <Typography variant="h6">User not found</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 4 }}>
      <Card>
        <CardContent>
          {/* User Basic Info */}
          <Typography variant="h4" gutterBottom>{user.name}</Typography>
          <Typography variant="subtitle1">{user.email}</Typography>
          <Typography variant="subtitle1">{user.phone}</Typography>
          <Typography variant="subtitle1">
            <Link href={user.website} target="_blank" rel="noopener noreferrer">
              {user.website}
            </Link>
          </Typography>

          {/* Address */}
          <Box mt={3}>
            <Typography variant="h6">Address</Typography>
            <Typography variant="body2">
              {user.address.street}, {user.address.suite}, {user.address.city}, {user.address.zipcode}
            </Typography>
          </Box>

          {/* Company */}
          <Box mt={3}>
            <Typography variant="h6">Company</Typography>
            <Typography variant="body2">{user.company.name}</Typography>
            <Typography variant="body2" color="textSecondary">{user.company.catchPhrase}</Typography>
          </Box>

          {/* Questionnaire Answers */}
          <Box mt={4}>
            <Typography variant="h6">Questionnaire Answers</Typography>
            {user.answers.map((answer) => (
              <Card key={answer.questionId} sx={{ my: 2, padding: 2 }}>
                <Typography variant="subtitle1">Question ID: {answer.questionId}</Typography>
                <Typography variant="body2">Answer: {answer.answer}</Typography>
                {answer.customText && (
                  <Typography variant="body2" color="textSecondary">
                    Comment: {answer.customText}
                  </Typography>
                )}
              </Card>
            ))}
          </Box>

          {/* Back to Home Button */}
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;
