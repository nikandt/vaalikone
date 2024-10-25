'use client';
import { useState } from 'react';
import { Container, Card, Typography, Button, Slider, Box } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';


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

const Vaalikone = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));

  const handleAnswer = (index: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = index;
    setAnswers(newAnswers);
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    }, 500);
  };

  const handleSkip = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
   
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <AnimatePresence>
          {questions.map((question, index) => (
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
                  style={{ padding: '2.5em', textAlign: 'center', marginBottom: '1.5em' }}
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
                      defaultValue={null}
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
      </Container>
    </ThemeProvider>
  );
};

export default Vaalikone;
