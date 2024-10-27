'use client';

import { useUsers } from '../data/users';
import { doManhattanMatch } from '../matching-algorithm/matchers/manhattan-matcher';
import { ANSWER_LABELS } from '../types/answer_labels';
import { Answer } from '../types/answers';
import { Candidate } from '../types/candidate';
import { Match } from '../types/matchers';

// Käyttäjän vastaukset
import { useUserAnswersStore } from '../data/useUserAnswersStore';

// Firebase 
import { saveQuestionnaireAnswers, fetchQuestionSet } from '../lib/firebase/firestore';
import { useState, useEffect } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Box,
  Button,
  Card,
  Container,
  LinearProgress,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const questionSetId = 'set_2024';

const findMatches = (
  userAnswers: Answer[],
  candidates: Candidate[],
): Match[] => {
  return candidates
    .map((candidate) =>
      doManhattanMatch(
        { answers: userAnswers },
        { ...candidate, id: candidate.id.toString() },
      ),
    )
    .sort((a, b) => a.distance - b.distance);
};

const Vaalikone = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { users: candidates } = useUsers();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { answers, setAnswer, updateCustomText, resetAnswers } =
    useUserAnswersStore();
  //const [answers, setAnswers] = useState<Answer[]>(Array.from({ length: questions.length }, () => ({ questionId: 0, answer: 0 })));
  const [isComplete, setIsComplete] = useState(false);
  const [matches, setMatches] = useState<Match[] | null>(null);
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  // Älä näytä vastausvaihtoehtoa ennen valintaa
  const [selectedAnswer, setSelectedAnswer] = useState<number>(0);

  useEffect(() => {
    const loadQuestions = async () => {
      const questionSet = await fetchQuestionSet(questionSetId);
      if (questionSet) {
        setQuestions(questionSet.questions); // Set the questions array from the fetched data
      }
      setLoading(false);
    };

    loadQuestions();
  }, []);

  const handleCustomTextChange = (questionId: number, text: string) => {
    updateCustomText(questionId, text);
  };

  const handleAnswer = (selectedAnswer: number) => {
    const currentQuestionId = questions[currentQuestionIndex].id;
    setAnswer({ questionId: currentQuestionId, answer: selectedAnswer });

    // Calculate matches
    const currentMatches = findMatches(answers, candidates);
    /*console.log(
      'Matches after question',
      currentQuestionIndex + 1,
      ':',
      currentMatches,
    );*/
    //console.log('Fetched candidates: ', candidates);
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

  if (loading) return <p>Loading questions...</p>;

  return (
    <Container maxWidth="md">
      <Box my={2}>
        <LinearProgress variant="determinate" value={progress} />
        <Typography variant="body2" color="textSecondary" align="center" mt={1}>
          {Math.round(progress)}%
        </Typography>
      </Box>
      <AnimatePresence>
        {!isComplete &&
          questions.map(
            (question, index) =>
              index === currentQuestionIndex && (
                <Box
                  key={question.id}
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 50,
                      position: 'absolute',
                      width: '100%',
                    }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      variant="outlined"
                      style={{
                        padding: '2.5em',
                        textAlign: 'center',
                        marginBottom: '1.5em',
                        paddingBottom: '3.5em',
                      }}
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        mb={2}
                      >
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
                            { value: 4, label: 'Täysin\nsamaa\nmieltä' },
                          ]}
                          sx={{
                            '& .MuiSlider-markLabel': {
                              fontSize: { xs: '0.75rem', sm: '0.875rem' },
                              textAlign: 'center',
                            },
                            '& .MuiSlider-thumb': {
                              display: selectedAnswer > 0 ? 'block' : 'none',
                              boxShadow: 'none !important',
                              outline: 'none !important',
                              border: 'none !important',
                              '&::before, &::after': {
                                // Remove shadow from potential pseudo-elements
                                display: 'none',
                                boxShadow: 'none !important',
                              },
                              '&:hover, &:active, &.Mui-focusVisible, &:focus':
                                {
                                  boxShadow: 'none !important',
                                  outline: 'none !important',
                                },
                            },
                          }}
                          onChange={(e, value) =>
                            setSelectedAnswer(value as number)
                          }
                          onChangeCommitted={(e, value) =>
                            handleAnswer(value as number)
                          }
                        />
                      </Box>
                    </Card>
                    <Box mt={2}>
                      <TextField
                        label="Lisää vastausteksti (valinnainen)"
                        variant="outlined"
                        fullWidth
                        onChange={(e) =>
                          handleCustomTextChange(question.id, e.target.value)
                        }
                      />
                    </Box>
                  </motion.div>
                </Box>
              ),
          )}
      </AnimatePresence>

      {isComplete && (
        <Box textAlign="center" mt={4}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleFindMatches}
          >
            Näytä tulokset
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleRedo}
            style={{ marginLeft: '10px' }}
          >
            Uudelleen
          </Button>

          <Typography variant="h5" mt={4} mb={2}>
            Matchit
          </Typography>

          {matches && (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={2}
              mt={2}
            >
              {matches.slice(0, 3).map((match) => {
                const candidate = candidates.find(
                  (c) => c.id.toString() === match.secondAnswererId.toString(),
                );
                return (
                  <Card
                    key={match.secondAnswererId}
                    sx={{ width: '100%', maxWidth: 400, padding: 2 }}
                  >
                    <Typography variant="h6">
                      {candidate?.name || 'Unknown Candidate'}
                    </Typography>
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
                const candidate = candidates.find(
                  (c) => c.id.toString() === match.secondAnswererId.toString(),
                );

                return (
                  <Box key={match.secondAnswererId} mb={3}>
                    <Typography variant="h6" mb={1}>
                      {candidate?.name} - Yksityiskohtainen vertailu
                    </Typography>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>
                            <strong>Kysymys</strong>
                          </TableCell>
                          <TableCell>
                            <strong>Vastauksesi</strong>
                          </TableCell>
                          <TableCell>
                            <strong>{candidate?.name} Vastaukset</strong>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {answers.map((answer) => {
                          const questionText =
                            questions.find((q) => q.id === answer.questionId)
                              ?.text || 'Unknown question';
                          const candidateAnswer = candidate?.answers?.find(
                            (a: Answer) => a.questionId === answer.questionId,
                          );
                          return (
                            <TableRow key={answer.questionId}>
                              <TableCell>
                                {questionText}
                                {candidateAnswer?.customText && (
                                  <Typography
                                    variant="body2"
                                    color="textSecondary"
                                    mt={0.5}
                                  >
                                    Vastausteksti: {candidateAnswer.customText}
                                  </Typography>
                                )}
                              </TableCell>
                              <TableCell>
                                {ANSWER_LABELS[answer.answer] || 'N/A'}
                              </TableCell>
                              <TableCell>
                                {candidateAnswer
                                  ? ANSWER_LABELS[candidateAnswer.answer]
                                  : 'N/A'}
                              </TableCell>
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
