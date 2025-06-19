import React, { useEffect, useState, useCallback } from "react";
import "./resultScroll.css";
import { useNavigate } from 'react-router-dom';
import DownArrow from "./Group1667.svg";

const userName = localStorage.getItem('name');

const q1 = localStorage.getItem('q1');
const q2 = localStorage.getItem('q2');
const q3 = localStorage.getItem('q3');

const q1_answer = localStorage.getItem('q1_answer');
const q2_answer = localStorage.getItem('q2_answer');
const q3_answer = localStorage.getItem('q3_answer');

const q1_feedback = localStorage.getItem('q1_feedback');
const q2_feedback = localStorage.getItem('q2_feedback');
const q3_feedback = localStorage.getItem('q3_feedback');
const total = localStorage.getItem('total');

console.log("q1:", q1);
console.log("q1_answer:", q1_answer);
console.log("q1_feedback:", q1_feedback);

const DownArrowIcon = () => (
  <img
    src={DownArrow}
    alt="Scroll down"
    style={{
      width: '134px',
      height: '175px',
      objectFit: 'contain'
    }}
  />
);

const DownArrowIcon2 = () => (
  <img
    src={DownArrow}
    alt="Scroll down"
    style={{
      width: '82px',
      height: '107px',
      objectFit: 'contain'
    }}
  />
);

const ResultSummary = ({ score }) => {
  const navigate = useNavigate();
  const handleRankingClick = () => {
    console.log("랭킹 버튼 클릭됨");
    navigate('/ranking');
  };
  return (
    <section className="section">
      <div className="score-row">
        <span className="MainScore">{score}</span>
        <span className="hundred">/ 100</span>
      </div>
      <button className="ranking-btn" onClick={handleRankingClick}>
        랭킹 보기
      </button>
    </section>
  );
};

function QASection({ questionNumber, questionText, yourAnswer, aiComment }) {
  return (
    <section className="section">
      <div className="question-title">
        <span className="question-number">{questionNumber}</span>
        <span className="question-text">{questionText}</span>
      </div>
      <div className="answer-comments-row">
        <div className="answer-comments-col">
          <div className="your-answer-content">
            <div className="your-answer-title">Your Answer</div>
            <div className="answer-question" dangerouslySetInnerHTML={{ __html: yourAnswer }} />
          </div>
          <div className="ai-comments-content">
            <div className="ai-comments-title">AI Comments</div>
            <p className="ai-answer">{aiComment}</p>
          </div>
        </div>
        <div className="answer-image-col">
          <div className="profile-image"><p className="error-p">현재 기기 문제로 캠이 작동하지 않습니다.<br/> 체험에 불편을 드려 죄송합니다 😖</p></div>
        </div>
      </div>
      <div className="result-scroll-text">
        <DownArrowIcon2 />
      </div>
    </section>
  );
}

function ResultScroll() {
  const qaData = [
    {
      questionNumber: "Q1.",
      questionText: q1,
      yourAnswer: q1_answer,
      aiComment: q1_feedback
    },
    {
      questionNumber: "Q2.",
      questionText: q2,
      yourAnswer: q2_answer,
      aiComment: q2_feedback
    },
    {
      questionNumber: "Q3.",
      questionText: q3,
      yourAnswer: q3_answer,
      aiComment: q3_feedback
    }
  ];

  const sections = [
    <section className="section intro-section" key="intro">
      <div className="result-title">
        <span className="result-highlight">{userName}</span>
        <span className="result-rest">님의 테스트 결과</span>
      </div>
      <div className="result-scroll-text">
        <DownArrowIcon />
      </div>
    </section>,
    ...qaData.map((qa, idx) => (
      <QASection
        key={idx}
        questionNumber={qa.questionNumber}
        questionText={qa.questionText}
        yourAnswer={qa.yourAnswer}
        aiComment={qa.aiComment}
      />
    )),
    <ResultSummary key="summary" score={total} />
  ];

  const [currentSection, setCurrentSection] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const totalSections = sections.length;

  const goToNextSection = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSection(prev => (prev + 1) % totalSections);
    setTimeout(() => setIsTransitioning(false), 1200);
  }, [totalSections, isTransitioning]);

  const goToPrevSection = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentSection(prev => prev === 0 ? totalSections - 1 : prev - 1);
    setTimeout(() => setIsTransitioning(false), 1200);
  }, [totalSections, isTransitioning]);

  const goToSection = useCallback((index) => {
    if (isTransitioning || index === currentSection) return;
    setIsTransitioning(true);
    setCurrentSection(index);
    setTimeout(() => setIsTransitioning(false), 1200);
  }, [currentSection, isTransitioning]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isTransitioning) return;

      switch (event.key) {
        case 'Enter':
        case 'ArrowDown':
        case ' ':
          event.preventDefault();
          goToNextSection();
          break;
        case 'ArrowUp':
          event.preventDefault();
          goToPrevSection();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextSection, goToPrevSection, isTransitioning]);

  useEffect(() => {
    let lastWheelTime = 0;
    const wheelThreshold = 800;

    const handleWheel = (event) => {
      event.preventDefault();
      const now = Date.now();
      if (now - lastWheelTime < wheelThreshold || isTransitioning) return;
      lastWheelTime = now;

      if (event.deltaY > 0) {
        goToNextSection();
      } else {
        goToPrevSection();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [goToNextSection, goToPrevSection, isTransitioning]);
  const API_BASE_URL = "http://3.39.189.31:3000";
  // DB 업데이트를 위한 useEffect 훅 추가
  useEffect(() => {
    const updateScore = async () => {
      if (userName && total) {
        try {
          const response = await fetch(`${API_BASE_URL}/users/score`, { // API 엔드포인트에 맞게 경로 수정 필요
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: userName, score: parseFloat(total) }), // total을 float으로 변환
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || '점수 업데이트 실패');
          }

          const result = await response.json();
          console.log('점수 업데이트 성공:', result);
        } catch (error) {
          console.error('점수 업데이트 중 오류 발생:', error.message);
        }
      }
    };

    updateScore();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  return (
    <div className="scroll-container">
      <div
        className="sections-wrapper"
        style={{
          transform: `translateY(-${currentSection * 100}vh)`
        }}
      >
        {sections.map((section, idx) => (
          <div key={idx} style={{ height: '100vh', width: '100vw' }}>
            {section}
          </div>
        ))}
      </div>

      <div className="scroll-indicator">
        {sections.map((_, idx) => (
          <div
            key={idx}
            className={`indicator-dot ${idx === currentSection ? 'active' : ''}`}
            onClick={() => goToSection(idx)}
          />
        ))}
      </div>

      <div className="keyboard-hint">
        <span>↑</span> <span>↓</span> <span>Enter</span> <span>Space</span> 또는 마우스 휠로 이동
      </div>
    </div>
  );
}

export default ResultScroll;