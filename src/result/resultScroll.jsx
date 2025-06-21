import React, { useEffect, useState, useCallback } from "react";
import "./resultScroll.css";
import { useNavigate } from 'react-router-dom';
import DownArrow from "./Group1667.svg";

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
  // useState로 localStorage 값들을 관리
  const [userData, setUserData] = useState({
    userName: '',
    q1: '',
    q2: '',
    q3: '',
    q1_answer: '',
    q2_answer: '',
    q3_answer: '',
    q1_feedback: '',
    q2_feedback: '',
    q3_feedback: '',
    total: ''
  });

  const [currentSection, setCurrentSection] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // localStorage 데이터를 읽어오는 함수
  const loadUserData = useCallback(() => {
    const newUserData = {
      userName: localStorage.getItem('name') || '',
      q1: localStorage.getItem('q1') || '',
      q2: localStorage.getItem('q2') || '',
      q3: localStorage.getItem('q3') || '',
      q1_answer: localStorage.getItem('q1_answer') || '',
      q2_answer: localStorage.getItem('q2_answer') || '',
      q3_answer: localStorage.getItem('q3_answer') || '',
      q1_feedback: localStorage.getItem('q1_feedback') || '',
      q2_feedback: localStorage.getItem('q2_feedback') || '',
      q3_feedback: localStorage.getItem('q3_feedback') || '',
      total: localStorage.getItem('total') || ''
    };

    console.log("Loading user data:", newUserData);
    setUserData(newUserData);
  }, []);

  // 컴포넌트 마운트 시와 focus 이벤트 시 데이터 로드
  useEffect(() => {
    loadUserData();

    // 페이지에 포커스가 돌아올 때마다 데이터 새로고침
    const handleFocus = () => {
      loadUserData();
    };

    // localStorage 변경 감지 (같은 탭에서)
    const handleStorageChange = () => {
      loadUserData();
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadUserData]);

  // qaData를 userData 기반으로 동적 생성
  const qaData = [
    {
      questionNumber: "Q1.",
      questionText: userData.q1,
      yourAnswer: userData.q1_answer,
      aiComment: userData.q1_feedback
    },
    {
      questionNumber: "Q2.",
      questionText: userData.q2,
      yourAnswer: userData.q2_answer,
      aiComment: userData.q2_feedback
    },
    {
      questionNumber: "Q3.",
      questionText: userData.q3,
      yourAnswer: userData.q3_answer,
      aiComment: userData.q3_feedback
    }
  ];

  const sections = [
    <section className="section intro-section" key="intro">
      <div className="result-title">
        <span className="result-highlight">{userData.userName}</span>
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
    <ResultSummary key="summary" score={userData.total} />
  ];

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
  
  // DB 업데이트를 위한 useEffect 훅
  useEffect(() => {
    const updateScore = async () => {
      if (userData.userName && userData.total) {
        try {
          const response = await fetch(`${API_BASE_URL}/users/score`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              name: userData.userName, 
              score: parseFloat(userData.total) 
            }),
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

    // userData가 로드된 후에만 실행
    if (userData.userName && userData.total) {
      updateScore();
    }
  }, [userData.userName, userData.total]); // userData 변경 시 실행

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