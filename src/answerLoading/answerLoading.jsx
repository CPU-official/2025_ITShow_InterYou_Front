import React from 'react';
import './answerLoading.css';

function AnswerLoading() {
  return (
    <div className="answer-loading-container">
      <div className="answer-loading-card">
        <div className="answer-loading-title">
          AI가 답변을 분석하는 중이에요!
        </div>
        <div className="answer-loading-wait">
          조금만 기다려주세요!
        </div>
      </div>
    </div>
  );
}

export default AnswerLoading;
