import React, { useEffect, useState, useCallback } from "react";
import "./resultScroll.css";
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
  return (
    <section className="section">
      <div className="score-row">
        <span className="score">{score}</span>
        <span className="hundred">/100</span>
      </div>
      <button className="ranking-btn">
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
          <div className="profile-image" />
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
      questionText: "빨간 벽돌을 건축 외 다른 용도로 사용할 수 있을까요?",
      yourAnswer: "동굴이야 작업할 때 모서리에 찔려 다치지 않을 수 있고,<br />운반에 용이하기 때문입니다.",
      aiComment: "맨홀 뚜껑이 원형인 이유에 대한 답변은 안전성과 운반의 편의성을 잘 지적하고 있으나, 다른 중요한 요소(구멍에 빠지지 않도록 하는 것)를 다루지 못한 점이 아쉽습니다. 좀 더 포괄적인 설명이 필요합니다."
    },
    {
      questionNumber: "Q2.",
      questionText: "맨홀 뚜껑은 왜 원형일까요?",
      yourAnswer: "원형이면 작업할 때 모서리에 찔려 다치지 않을 수 있고,<br />운반에 용이하기 때문입니다.",
      aiComment: "맨홀 뚜껑이 원형인 이유에 대한 답변은 안전성과 운반의 편의성을 잘 지적하고 있으나, 다른 중요한 요소(구멍에 빠지지 않도록 하는 것)를 다루지 못한 점이 아쉽습니다."
    },
    {
      questionNumber: "Q3.",
      questionText: "창의성을 기르는 방법은 무엇일까요?",
      yourAnswer: "다양한 경험을 해보고 여러 관점에서 생각해보며<br />기존의 틀에서 벗어나 새로운 시도를 하는 것입니다.",
      aiComment: "창의성을 기르는 방법에 대한 답변이 포괄적이고 실용적입니다. 다양한 경험과 관점의 중요성을 잘 언급했으며, 실제로 적용 가능한 조언을 제공했습니다."
    }
  ];

  const sections = [
    <section className="section intro-section" key="intro">
      <div className="result-title">
        <span className="result-highlight">전유림</span>
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
    <ResultSummary key="summary" score={89.01} />
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

      switch(event.key) {
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
