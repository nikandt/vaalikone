'use client';
import { useState } from 'react';
import { Container, Card, Typography, Button, Slider, Box } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

import { doManhattanMatch } from '../matching-algorithm/matchers/manhattan-matcher';
import { Answer, Candidate, Match } from '../types';


const generateRandomAnswers = (numQuestions: number): Answer[] => {
  return Array.from({ length: numQuestions }, (_, idx) => ({
    questionId: idx + 1,
    answer: Math.floor(Math.random() * 4) + 1
  }));
};
{/*}
const exampleCandidates: Candidate[] = [
  { id: 'candidate-1', answers: generateRandomAnswers(8) },
  { id: 'candidate-2', answers: generateRandomAnswers(8) },
  { id: 'candidate-3', answers: generateRandomAnswers(8) }
];*/}
const exampleCandidates: Candidate[] = [
  {
    id: 'candidate-1',
    answers: [
      { questionId: 1, answer: 1 },
      { questionId: 2, answer: 3 },
      { questionId: 3, answer: 2 },
      { questionId: 4, answer: 4 },
      { questionId: 5, answer: 1 },
      { questionId: 6, answer: 1 },
      { questionId: 7, answer: 1 },
      { questionId: 8, answer: 1 }
    ]
  },
  {
    id: 'candidate-2',
    answers: [
      { questionId: 1, answer: 3 },
      { questionId: 2, answer: 2 },
      { questionId: 3, answer: 1 },
      { questionId: 4, answer: 4 },
      { questionId: 5, answer: 2 },
      { questionId: 6, answer: 1 },
      { questionId: 7, answer: 4 },
      { questionId: 8, answer: 3 }
    ]
  },
  {
    id: 'candidate-3',
    answers: [
      { questionId: 1, answer: 2 },
      { questionId: 2, answer: 2 },
      { questionId: 3, answer: 3 },
      { questionId: 4, answer: 1 },
      { questionId: 5, answer: 4 },
      { questionId: 6, answer: 4 },
      { questionId: 7, answer: 4 },
      { questionId: 8, answer: 4 }
    ]
  }
];
const questions = [
  { id: 1, category: "Arvot", text: "Jos en jaksa kokata, wolttaan." },
  { id: 2, category: "Arvot", text: "Turun pitäisi olla Suomen pääkaupunki." },
  { id: 3, category: "Arvot", text: "Katson mieluummmin YouTube-videoita kuin kuuntelen podcasteja." },
  { id: 4, category: "Arvot", text: "Nykyään muutetaan yhteen liian matalalla kynnyksellä." },
  { id: 5, category: "Turvallisuus", text: "Vekaranjärven laivastotukikohta tulisi lakkauttaa." },
  { id: 6, category: "Turvallisuus", text: "Stubbin tulisi esittää uskottava suunnitelma Suur-Suomen laajentamiseksi." },
  { id: 7, category: "Turvallisuus", text: "Oblivionissa pitäisi olla enemmän vartijoita." },
  { id: 8, category: "Turvallisuus", text: "Väinämöinen II:n laukaisukoodien salaustasoa tulisi korottaa." },

];

const exampleCitizenAnswers: Answer[] = [
  { questionId: 1, answer: 2 },
  { questionId: 2, answer: 3 },
  { questionId: 3, answer: 1 },
  { questionId: 4, answer: 4 },
  { questionId: 5, answer: 2 },
  { questionId: 6, answer: 1 },
  { questionId: 7, answer: 4 },
  { questionId: 8, answer: 3 }
];

const testMatcher = () => {
  const matches: Match[] = exampleCandidates.map(candidate =>
    doManhattanMatch({ answers: exampleCitizenAnswers }, candidate)
  );
  console.log("Match Results:", matches);
};

const findMatches = (userAnswers: Answer[], candidates: Candidate[]): Match[] => {
  return candidates
    .map(candidate => doManhattanMatch({ answers: userAnswers }, candidate))
    .sort((a, b) => a.distance - b.distance);
};

const Vaalikone = () => {
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
              Run Test
            </Button>
          </Box>
        )}

      </Container>
  );
};

export default Vaalikone;

