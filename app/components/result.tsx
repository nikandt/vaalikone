'use client';

import { useState, useEffect } from 'react';
import { Container, Card, Typography, Button, Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { useUsers } from '../data/users';
import { questions } from '../data/questions';

const ElectionResults = () => {
  const { users: exampleCandidates, loading } = useUsers();
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    if (!loading) {
      const calculatedMatches = exampleCandidates.map((candidate, index) => ({
        candidate,
        score: Math.floor(Math.random() * 100), // Simulated score for now
        userAnswers: candidate.answers,
        candidateAnswers: candidate.answers,
      }));
      setMatches(calculatedMatches);
    }
  }, [exampleCandidates, loading]);

  const handleRedo = () => {
    console.log("Redo");
  };

  return (
    <Container maxWidth="md">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4">Election Questionnaire Results</Typography>
        <Button variant="outlined" onClick={handleRedo}>
          Restart Questionnaire
        </Button>
      </Box>

      <Box display="flex" gap={2} mt={2}>
        {matches.slice(0, 3).map((match) => (
          <Card key={match.candidate.id} sx={{ flexGrow: 1 }}>
            <Box p={2}>
              <Typography variant="h6">{match.candidate.name}</Typography>
              <Typography variant="body2" color="textSecondary">
                Match: {match.score}%
              </Typography>
              <Button size="small" variant="outlined" onClick={() => console.log("View Details", match.candidate.id)}>
                View Details
              </Button>
            </Box>
          </Card>
        ))}
      </Box>
      
      <Box mt={4}>
        {matches.map((match) => (
          <Box key={match.candidate.id} mb={2}>
            <Typography variant="h6" mb={1}>
              {match.candidate.name} - Detailed Comparison
            </Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Question</TableCell>
                  <TableCell>User Answer</TableCell>
                  <TableCell>Candidate Answer</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {match.userAnswers.map((answer, index) => (
                  <TableRow key={answer.questionId}>
                    <TableCell>{questions.find((q) => q.id === answer.questionId)?.text}</TableCell>
                    <TableCell>{answer.answer}</TableCell>
                    <TableCell>{match.candidateAnswers[index]?.answer}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        ))}
      </Box>
    </Container>
  );
};

export default ElectionResults;
