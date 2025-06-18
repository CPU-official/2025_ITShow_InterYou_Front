import React from "react";
import "./window.css";
import roll1 from './Group 1667.svg';
import roll2 from './Group 1667(1).svg';

function Window() {
  return (
    <div className="scroll-container">
      {/* 첫 번째 섹션: 인트로 */}
      <section className="section intro-section">
        <div className="result-title">
          <span className="result-highlight">전유림</span>
          <span className="result-rest">님의 테스트 결과</span>
        </div>  
        <img src={roll1} alt="스크" className="result-scroll-text"/>
      </section>

      {/* 두 번째 섹션: 결과 */}
      <section className="section result-section">
        <div className="question-title">
          <span className="question-number">Q1.</span>
          <span className="question-text">빨간 벽돌을 건축 외 다른 용도로 사용할 수 있을까요?</span>
        </div>
        <div className="answer-comments-row">
          <div className="answer-comments-col">
            <div className="your-answer-content">
               <div className="your-answer-title">Your Answer</div>
              <p className="answer-question">동굴이야 작업할 때 모서리에 찔려 다치지 않을 수 있고,<br />
              운반에 용이하기 때문입니다.</p>
            </div>
            
            <div className="ai-comments-content">
              <div className="ai-comments-title">AI Comments</div>
              <p className="ai-answer">맨홀 뚜껑이 원형인 이유에 대한 답변은 안전성과 운반의 편의성을 잘 지적하고 있으나, 
              다른 중요한 요소(구멍에 빠지지 않도록 하는 것)를 다루지 못한 점이 아쉽습니다. 
              좀 더 포괄적인 설명이 필요합니다.</p>
            </div>
          </div>
          <div className="answer-image-col">
            {/* 이미지 영역 */}
            <div className="profile-image" />
          </div>
        </div>
        <img src={roll2} alt="스크" className="result-scroll-text"/>     
      </section>
      <section>
  <div className="question-title">
    <span className="question-number">Q2</span>
    <span className="question-text">빨간 벽돌을 건축 외 다른 용도로 사용할 수 있을까요?</span>
  </div>
  <div className="answer-comments-row">
    <div className="answer-comments-col"> 
      <div className="your-answer-content">
        <div className="your-answer-title">Your Answer</div>
        <p className="answer-question">동굴이야 작업할 때 모서리에 찔려 다치지 않을 수 있고,<br />운반에 용이하기 때문입니다.</p>
      </div>
      <div className="ai-comments-content">
        <div className="ai-comments-title">AI Comments</div>
        <p className="ai-answer">맨홀 뚜껑이 원형인 이유에 대한 답변은 안전성과 운반의 편의성을 잘 지적하고 있으나, 다른 중요한 요소(구멍에 빠지지 않도록 하는 것)를 다루지 못한 점이 아쉽습니다. 좀 더 포괄적인 설명이 필요합니다.</p>
      </div>
    </div>
    <div className="answer-image-col">
      <div className="profile-image" />
    </div>
  </div>
  <img src={roll2} alt="스크" className="result-scroll-text"/>
</section>
    </div>
  );
}

export default Window;
