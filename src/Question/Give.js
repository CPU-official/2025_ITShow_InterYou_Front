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
    const [shuffledQuestions] = useState(() => {
      const stored = localStorage.getItem('pickedQuestions');
      if (stored) return JSON.parse(stored);
      const newQuestions = shuffle(questions).slice(0, 3); // 3개만 쓸 경우
      localStorage.setItem('pickedQuestions', JSON.stringify(newQuestions));
      return newQuestions;
    });
    return shuffledQuestions;
  }