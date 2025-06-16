import React from 'react';
import './answerComplete.css';

function AnswerComplete() {
  return (
    <div className="answer-complete-container">
      <div className="answer-complete-card">
        <div className="answer-complete-title">
          AI가 분석을 끝냈어요!
        </div>
        <div className="answer-complete-desc">
          3초 뒤 결과창으로 이동합니다!
        </div>
      </div>
      <img
        src="/checkComplete.png"
        className="answer-complete-png"
      />
    </div>
  );
}

export default AnswerComplete;
