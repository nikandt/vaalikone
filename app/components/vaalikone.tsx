'use client';
import { useState } from 'react';
import { Container, Card, LinearProgress, TextField, Typography, Button, Slider, Box, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

import { doManhattanMatch } from '../matching-algorithm/matchers/manhattan-matcher';
import { Answer } from '../types/answers';
import { Candidate } from '../types/candidate';
import { Match } from '../types/matchers';
import { questions } from '../data/questions';
import { useUsers } from '../data/users';
import { ANSWER_LABELS } from '../types/answer_labels';

// Käyttäjän vastaukset
import { useUserAnswersStore } from '../data/useUserAnswersStore';

// Firebase test
import { saveQuestionnaireAnswers } from "../lib/firebase/firestore";

{/*const generateRandomAnswers = (numQuestions: number): Answer[] => {
  return Array.from({ length: numQuestions }, (_, idx) => ({
    questionId: idx + 1,
    answer: Math.floor(Math.random() * 4) + 1
  }));
};
}*/}

{/*
const testMatcher = () => {
  const matches: Match[] = exampleCandidates.map(candidate =>
    doManhattanMatch({ answers: exampleCitizenAnswers }, candidate)
  );
  console.log("Match Results:", matches);
};*/}

const findMatches = (userAnswers: Answer[], candidates: Candidate[]): Match[] => {
  return candidates
    .map(candidate => doManhattanMatch({ answers: userAnswers }, candidate))
    .sort((a, b) => a.distance - b.distance);
};

const Vaalikone = () => {
  const { users: candidates } = useUsers();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { answers, setAnswer, updateCustomText, resetAnswers } = useUserAnswersStore();
  //const [answers, setAnswers] = useState<Answer[]>(Array.from({ length: questions.length }, () => ({ questionId: 0, answer: 0 })));
  const [isComplete, setIsComplete] = useState(false);
  const [matches, setMatches] = useState<Match[] | null>(null);
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Älä näytä vastausvaihtoehtoa ennen valintaa
  const [selectedAnswer, setSelectedAnswer] = useState<number>(0);

  const handleCustomTextChange = (questionId: number, text: string) => {
    updateCustomText(questionId, text);
  };

  const handleAnswer = (selectedAnswer: number) => {
    const currentQuestionId = questions[currentQuestionIndex].id;
    setAnswer({ questionId: currentQuestionId, answer: selectedAnswer });

    // Calculate matches
    const currentMatches = findMatches(answers, candidates);
    console.log("Matches after question", currentQuestionIndex + 1, ":", currentMatches);

    //console.log("Finding matches for: ", answers);
    //console.log("Comparing to: ", candidates);

    setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          setIsComplete(true);
          saveQuestionnaireAnswers(answers); // Save to firebase
          setMatches(currentMatches);
        }
        setSelectedAnswer(0);
    }, 500);
};

const handleRedo = () => {
  resetAnswers();
  setCurrentQuestionIndex(0);
  setIsComplete(false);
  setMatches(null);
};

  const handleSkip = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleFindMatches = () => {
    //const userMatches = findMatches(answers, candidates);
    //setMatches(userMatches);
    //console.log("Matches:", userMatches);
  };

  return (
      <Container maxWidth="md">
      <Box my={2}>
        <LinearProgress variant="determinate" value={progress} />
        <Typography variant="body2" color="textSecondary" align="center" mt={1}>
          {Math.round(progress)}%
        </Typography>
      </Box>
        <AnimatePresence> 
          { !isComplete && questions.map((question, index) => (
            index === currentQuestionIndex && (
              <Box
              key={question.id}
              style={{ position: 'relative', width: '100%', height: '100%' }}
            >
              <motion.div
                initial={{ opacity: 0, y: 50, position: 'absolute', width: '100%' }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  variant="outlined"
                  style={{ padding: '2.5em', textAlign: 'center', marginBottom: '1.5em', paddingBottom: '3.5em' }}
                >
                  <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                    <Box
                      style={{
                        backgroundColor: '#333',
                        color: '#fff',
                        padding: '0.2em 0.6em',
                        borderRadius: '0.2em',
                        marginRight: '0.5em',
                        fontWeight: 'bold',
                      }}
                    >
                      {`${index + 1}/${questions.length}`}
                    </Box>
                    <Typography variant="h6" component="span">
                      {question.category}
                    </Typography>
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    {question.text}
                  </Typography>
                  <Box mb={2}>
                    <Button
                      startIcon={<FontAwesomeIcon icon={faEyeSlash} />}
                      onClick={handleSkip}
                    >
                      Jätä vastaamatta
                    </Button>
                  </Box>
                  <Box px={3}>
                    <Slider
                      value={selectedAnswer}
                      step={1}
                      min={1}
                      max={4}
                      marks={[
                        { value: 1, label: 'Täysin\neri\nmieltä' },
                        { value: 2, label: 'Jokseenkin\neri\nmieltä' },
                        { value: 3, label: 'Jokseenkin\nsamaa\nmieltä' },
                        { value: 4, label: 'Täysin\nsamaa\nmieltä' }
                      ]}
                      sx={{
                        '& .MuiSlider-thumb': {
                          display: selectedAnswer > 0 ? 'block' : 'none',
                          boxShadow: 'none !important',
                          outline: 'none !important',
                          border: 'none !important',
                          '&::before, &::after': { // Remove shadow from potential pseudo-elements
                            display: 'none',
                            boxShadow: 'none !important',
                          },
                          '&:hover, &:active, &.Mui-focusVisible, &:focus': {
                            boxShadow: 'none !important',
                            outline: 'none !important',
                          },
                        },
                      }}
                      onChange={(e, value) => setSelectedAnswer(value as number)}
                      onChangeCommitted={(e, value) => handleAnswer(value as number)}
                    />
                  </Box>
                </Card>
                <Box mt={2}>
                    <TextField
                      label="Lisää vastausteksti (valinnainen)"
                      variant="outlined"
                      fullWidth
                      onChange={(e) => handleCustomTextChange(question.id, e.target.value)}
                    />
                  </Box>
                </motion.div>
      </Box>

      
            )
          ))}

        </AnimatePresence>

        {isComplete && (
  <Box textAlign="center" mt={4}>
    <Button variant="contained" color="primary" onClick={handleFindMatches}>
      Näytä tulokset
    </Button>
    <Button variant="outlined" color="secondary" onClick={handleRedo} style={{ marginLeft: '10px' }}>
      Uudelleen
    </Button>

    <Typography variant="h5" mt={4} mb={2}>Matchit</Typography>

    {matches && (
      <Box display="flex" flexDirection="column" alignItems="center" gap={2} mt={2}>
        {matches.slice(0, 3).map((match) => {
          const candidate = candidates.find(c => c.id === match.secondAnswererId);
          return (
            <Card key={match.secondAnswererId} sx={{ width: '100%', maxWidth: 400, padding: 2 }}>
              <Typography variant="h6">{candidate?.name || "Unknown Candidate"}</Typography>
              <Typography variant="body2" color="textSecondary">
                Yhteensopivuus: {(match.percentage * 100).toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Etäisyys: {match.distance}
              </Typography>
            </Card>
          );
        })}
      </Box>
    )}

        {matches && (
          <Box mt={4}>
            {matches.map((match) => {
              const candidate = candidates.find(c => c.id === match.secondAnswererId);
              return (
                <Box key={match.secondAnswererId} mb={3}>
                  <Typography variant="h6" mb={1}>
                    {candidate?.name} - Yksityiskohtainen vertailu
                  </Typography>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Kysymys</strong></TableCell>
                        <TableCell><strong>Vastauksesi</strong></TableCell>
                        <TableCell><strong>{candidate?.name} Vastaukset</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                    {answers.map((answer) => {
                      const questionText = questions.find(q => q.id === answer.questionId)?.text || "Unknown question";
                      const candidateAnswer = candidate?.answers?.find((a : Answer) => a.questionId === answer.questionId);
                      return (
                        <TableRow key={answer.questionId}>
                          <TableCell>
                            {questionText}
                            {candidateAnswer?.customText && (
                              <Typography variant="body2" color="textSecondary" mt={0.5} >
                                Vastausteksti: {candidateAnswer.customText}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>{ANSWER_LABELS[answer.answer] || "N/A"}</TableCell>
                          <TableCell>{ANSWER_LABELS[candidateAnswer?.answer] || "N/A"}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                  </Table>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    )}



      </Container>
  );
};

export default Vaalikone;

