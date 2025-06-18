// ResultSummary.js
import React from 'react';
import './window.css';

   function ResultSummary({ score }) {
  return (
    <div className="result-summary-box">
      <div className="score-row">
        <span className="sum">총점 : </span>
        <span className="score">{score}</span>
        <span className="hundred"> / 100 점</span>
        
      </div>
      <br />
      <button className="ranking-btn">랭킹보기 &gt;</button>
    </div>
    
  );
}

export default ResultSummary;