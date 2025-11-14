import React, { useState, useEffect } from 'react';
import './QuestionAll.css';
import { useNavigate } from 'react-router-dom';
import Question1 from './title_2.svg';
import Think from './think_1.svg';
import useShuffledQuestions from './Give'; // 커스텀 훅 import

function Question2() {
  const [progress, setProgress] = useState(35);
  const [timeLeft, setTimeLeft] = useState(5);
  const navigate = useNavigate();
  const shuffledQuestions = useShuffledQuestions(); // 커스텀 훅 사용

  useEffect(() => {
    if (shuffledQuestions.length < 2) return; // 두 번째 질문이 있는지 확인
    const target = 67;
    setTimeout(() => setProgress(target), 100);
    localStorage.setItem('q2', shuffledQuestions[1]);
    console.log('두 번째 질문 저장:', shuffledQuestions[1]);
  }, [shuffledQuestions]);

  useEffect(() => {
    if (shuffledQuestions.length < 2) return; // 두 번째 질문이 있는지 확인
    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 0) {
          clearInterval(timerInterval);
          navigate('/speaking2', { state: { question: shuffledQuestions[1] } });
        }
        return prev > 0 ? prev - 1 : 0;
      });
    }, 1300);

    return () => {
      clearInterval(timerInterval);
    };
  }, [navigate, shuffledQuestions]);

  const circleRadius = 110;
  const circleCircumference = 2 * Math.PI * circleRadius;
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
                transition: "background 0.7s cubic-bezier(.4,2,.6,1)"
              }}
            />
          ))}
        </div>
      </div>
      <div className="question-box">
        <img src={Question1} alt="질문2" className="question-title2" />
        <p className="question-text2">
          {shuffledQuestions.length > 1 ? shuffledQuestions[1] : "질문을 불러오는 중..."}
        </p>
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
            className="circle-progress1"
            cx="122"
            cy="118"
            r={circleRadius}
            style={{
              strokeDasharray: circleCircumference,
              strokeDashoffset: circleCircumference * (1 + timeLeft / 5),
            }}
          ></circle>
        </svg>
        <span className="timer-number">{timeLeft}</span>
      </div>
    </div>
  );
}

export default Question2;