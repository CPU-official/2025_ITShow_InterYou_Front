import { useState } from 'react';
import questions from './questions.json';

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function useShuffledQuestions() {
  const [shuffledQuestions] = useState(() => shuffle(questions));
  return shuffledQuestions;
}