import React, { useState, useEffect } from 'react';
import './answerLoading.css';
import AnswerComplete from '../answerComplete/answerComplete';

function AnswerLoading() {
  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowComplete(true);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  return showComplete ? (
    <AnswerComplete />
  ) : (
    <div className="answer-loading-container">
      <div className="answer-loading-card">
        <div className="answer-loading-title">
          AI가 답변을 분석하는 중이에요!
        </div>
        <div className="answer-loading-wait">
          조금만 기다려주세요!
        </div>
      </div>

      <img
        src="/Loading.gif"
        className="answer-loading-gif"
      />
    </div>
  );
}

export default AnswerLoading;
