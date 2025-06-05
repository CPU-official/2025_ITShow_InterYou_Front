import React, { useState, useEffect } from 'react';
import AnswerLoading from './answerLoading/answerLoading';
import AnswerComplete from './answerComplete/answerComplete';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {isLoading ? <AnswerLoading /> : <AnswerComplete />}
    </div>
  );
}

export default App;
