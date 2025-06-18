import React, { useState, useEffect } from 'react';
import './answerLoading.css';
import ResultScroll from '../result/resultScroll';
function AnswerLoading() {
  const [showComplete, setShowComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowComplete(true);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  return showComplete ? (
    <ResultScroll />
  ) : (
    <div className="answer-loading-container">
      <div className="answer-loading-card">
        <div className="answer-loading-title">
          AI가 답변을 분석하는 중이에요!
        </div>
        <div className="answer-loading-wait">
          분석이 끝나면 결과창으로 이동합니다!
        </div>
      </div>

      <img
        src="/Loading.gif"
        className="answer-loading-gif"
        alt="load"
      />
    </div>
  );
}

export default AnswerLoading;
