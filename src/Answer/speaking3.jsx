import React, { useState, useEffect } from 'react';
import './speaking3.css';
import { useNavigate,useLocation } from 'react-router-dom';
import Question1 from '../Question/title_3.svg';
import Think from './answer_1.svg';
function Speaking3() {
  
  const location3 = useLocation();
  const question3 = location3.state?.question || "질문이 없습니다."; // 질문 가져오기
  const [progress] = useState(100);
  const [timeLeft, setTimeLeft] = useState(10); // 타이머 초기값
  const navigate = useNavigate();
  


  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 0) {
          clearInterval(timerInterval); 
          navigate('/answerLoading'); // 타이머 종료 후 페이지 이동 
        }
        return prev > 0 ? prev - 1 : 0; // 타이머 감소
      }); 
    }, 1200);

    return () => {
      clearInterval(timerInterval); // 컴포넌트 언마운트 시 타이머 정리
    };  
  }, [navigate]);

  const circleRadius = 110; // 반지름   
  const circleCircumference = 2 * Math.PI * circleRadius; // 원 둘레

  // 점 개수와 진행도 계산
const dotPercents = [0, 33, 66, 99];

  return (
    <div className="start-container">
      <div className="progress-bar">
        <div
          className="progress"
          style={{ width: `${progress}%`, transition: 'width 1s ease-in-out' }}
        ></div>
         <div className="progress-dots">
        {dotPercents.map((percent, idx) => (
      <div
        key={idx}
        className={`dot dot${idx + 1} ${progress >= percent ? "dot-filled" : ""}`}
        style={{
          transition: "background 0.7s cubic-bezier(.4,2, .6,1)"
        }}
      />
    ))}
    </div>
      </div>
      <div className="question-box">
        <img src={Question1} alt="질문3" className="question-title3" />
        <p className="question-text2">{question3}</p>
        <p className="timer-text">
          <img src={Think} alt="생각하는 이미지" className="think-image1" />
        </p>
      </div>
      <div className="timer-circle">
        <svg className="circle-svg">
          <circle
            className="circle-background"
            cx="122"
            cy="118"
            r={circleRadius}
          ></circle>
          <circle
            className="circle-progress" 
            cx="122"
            cy="118"
            r={circleRadius}
            style={{
              strokeDasharray: circleCircumference,
              strokeDashoffset: circleCircumference * (1 + timeLeft / 10),
            }}
          ></circle>
        </svg>
        <span className="timer-number1">{timeLeft}</span>
      </div>
    </div>
  );
}

export default Speaking3;