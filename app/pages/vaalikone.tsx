'use client';
import { useState } from 'react';
import { Container, Card, Typography, Button, Slider, Box } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

import { doManhattanMatch } from '../matching-algorithm/matchers/manhattan-matcher';
import { Answer, Candidate, Match } from '../types';
import { useUsers } from '../data/users';
import { questions } from '../data/questions';



{/*const generateRandomAnswers = (numQuestions: number): Answer[] => {
  return Array.from({ length: numQuestions }, (_, idx) => ({
    questionId: idx + 1,
    answer: Math.floor(Math.random() * 4) + 1
  }));
};*/}

{/*const testMatcher = () => {
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
  const { users: exampleCandidates, loading } = useUsers();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>(Array.from({ length: questions.length }, () => ({ questionId: 0, answer: 0 })));
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [isComplete, setIsComplete] = useState(false);


  const handleAnswer = (selectedAnswer: number) => {
    const newAnswers = [...answers];
    const currentQuestionId = questions[currentQuestionIndex].id;
    const existingAnswerIndex = newAnswers.findIndex(
        answer => answer && answer.questionId === currentQuestionId
    );
    const newAnswer = { questionId: currentQuestionId, answer: selectedAnswer };

    if (existingAnswerIndex !== -1) {
        newAnswers[existingAnswerIndex] = newAnswer;
    } else {
        newAnswers[currentQuestionIndex] = newAnswer;
    }
    setAnswers(newAnswers);
    setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
          setIsComplete(true);
        }
    }, 500);
};

const handleRedo = () => {
  setAnswers(Array(questions.length).fill(null));
  setCurrentQuestionIndex(0);
  setIsComplete(false);
};

  const handleSkip = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleFindMatches = () => {
    const userMatches = findMatches(answers, exampleCandidates);
    //setMatches(userMatches);
    console.log("Matches:", userMatches);

  };

  return (
      <Container maxWidth="md">
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
                      defaultValue={undefined}
                      step={1}
                      min={1}
                      max={4}
                      marks={[
                        { value: 1, label: 'Täysin\neri\nmieltä' },
                        { value: 2, label: 'Jokseenkin\neri\nmieltä' },
                        { value: 3, label: 'Jokseenkin\nsamaa\nmieltä' },
                        { value: 4, label: 'Täysin\nsamaa\nmieltä' }
                      ]}
                      onChangeCommitted={(e, value) => handleAnswer(value as number)}
                    />
                  </Box>
                </Card>
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
          </Box>
        )}

      </Container>
  );
};

export default Vaalikone;

