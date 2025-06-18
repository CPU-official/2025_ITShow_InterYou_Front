import React from "react";
import "./resultScroll.css";
import roll1 from './Group 1667.svg';
import roll2 from './Group 1667(1).svg';
import ResultSummary from "./ResultSummary";
// import { queries } from "@testing-library/dom";

// Q&A 섹션 컴포넌트 분리
function QASection({ questionNumber, questionText, yourAnswer, aiComment, imageSrc }) {
  return (
    <section className="section result-section">
      <div className="question-title">
        <span className="question-number">{questionNumber}</span>
        <span className="question-text">{questionText}</span>
      </div>

      <div className="answer-comments-row">
        <div className="answer-comments-col">
          <div className="your-answer-content">
            <div className="your-answer-title">Your Answer</div>
            <p className="answer-question">{yourAnswer}</p>
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
      <img src={imageSrc} alt="스크" className="result-scroll-text"/>
    </section>
  );
}

function resultScrole() {
  // Q&A 데이터 배열로 관리
  const qaData = [
    {
      questionNumber: "Q1.",
      questionText: "빨간 벽돌을 건축 외 다른 용도로 사용할 수 있을까요?",
      yourAnswer: "동굴이야 작업할 때 모서리에 찔려 다치지 않을 수 있고,<br />운반에 용이하기 때문입니다.",
      aiComment: "맨홀 뚜껑이 원형인 이유에 대한 답변은 안전성과 운반의 편의성을 잘 지적하고 있으나, 다른 중요한 요소(구멍에 빠지지 않도록 하는 것)를 다루지 못한 점이 아쉽습니다. 좀 더 포괄적인 설명이 필요합니다.",
      imageSrc: roll2
    },
    {
      questionNumber: "Q2.",
      questionText: "빨간 벽돌을 건축 외 다른 용도로 사용할 수 있을까요?",
      yourAnswer: "동굴이야 작업할 때 모서리에 찔려 다치지 않을 수 있고,<br />운반에 용이하기 때문입니다.",
      aiComment: "맨홀 뚜껑이 원형인 이유에 대한 답변은 안전성과 운반의 편의성을 잘 지적하고 있으나, 다른 중요한 요소(구멍에 빠지지 않도록 하는 것)를 다루지 못한 점이 아쉽습니다. 좀 더 포괄적인 설명이 필요합니다.",
      imageSrc: roll2
    },
    {
      questionNumber : "Q3",
      questionText : "민정원은 왜 잘생겼을까요.",
      yourAnswer : "이민준은 아이돌 연습생으로서 관리 받은 얼굴이기 때문에<br /> 잘생길 수 밖에 없습니다.",
      aiComment: "이민준 ", 
      imageSrc : roll2
    }

  ];

  return (
    <div className="scroll-container">
      {/* 인트로 섹션 */}
      <section className="section intro-section">
        <div className="result-title">
          <span className="result-highlight">전유림</span>
          <span className="result-rest">님의 테스트 결과</span>
        </div>
        <img src={roll1} alt="스크" className="result-scroll-text"/>
      </section>

      {/* Q&A 섹션 반복 렌더링 */}
      {qaData.map((qa, idx) => (
        <QASection
          key={idx}
          questionNumber={qa.questionNumber}
          questionText={qa.questionText}
          yourAnswer={<span dangerouslySetInnerHTML={{__html: qa.yourAnswer}} />}
          aiComment={qa.aiComment}
          imageSrc={qa.imageSrc}
        />
      ))}

     <div>
  <ResultSummary score={89.01} />
</div>
    </div>
  );
}

export default resultScrole;