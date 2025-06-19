// ResultSummary.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './resultScroll.css';

function ResultSummary({ score }) {
  const navigate = useNavigate(); // 

  const handleRankingClick = () => {
    console.log("랭킹 버튼 클릭됨");
    navigate('/ranking'); 
  };
  return (
    <div className="result-summary-box">
      <div className="score-row">
        <span className="sum">총점 : </span>
        <span className="score">{score}</span>
        <span className="hundred"> / 100 점</span>

      </div>
      <br />
      <button className="ranking-btn" onClick={handleRankingClick}>랭킹보기 &gt;</button>
    </div>

  );
}

export default ResultSummary;