# 2025_ITShow_InterYou_Front
2025 IT Show 출품작 InterYou - Frontend



 useEffect(() => {
    // 프로그램 시작 시 기존 질문 세트 삭제
    localStorage.removeItem('pickedQuestions');
    localStorage.removeItem('q1');
    localStorage.removeItem('q2');
    localStorage.removeItem('q3');
  }, []);

  import { useState } from 'react';
  import questions from './questions.json';

  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  export default function useShuffledQuestions() {
    const [shuffledQuestions] = useState(() => {
      const stored = localStorage.getItem('pickedQuestions');
      if (stored) return JSON.parse(stored);
      const newQuestions = shuffle(questions).slice(0, 3); // 3개만 쓸 경우
      localStorage.setItem('pickedQuestions', JSON.stringify(newQuestions));
      return newQuestions;
    });
    return shuffledQuestions;
  }


import React, { useState, useEffect } from 'react';
import './QuestionAll.css';
import { useNavigate } from 'react-router-dom';
import Question1 from './title_1.svg';
import Think from './think_1.svg';
import useShuffledQuestions from './Give'; // <- 커스텀 훅 import

function Question() {
  const [progress, setProgress] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const navigate = useNavigate();
  const shuffledQuestions = useShuffledQuestions(); // <- 커스텀 훅 사용

  useEffect(() => {
    if (shuffledQuestions.length === 0) return;
    const target = 34;
    setTimeout(() => setProgress(target), 100);
    localStorage.setItem('q1', shuffledQuestions[0]);
    console.log('첫 번째 질문 (q1)이 로컬 스토리지에 저장되었습니다:', shuffledQuestions[0]);
  }, [shuffledQuestions]);

  useEffect(() => {
    if (shuffledQuestions.length === 0) return;
    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 0) {
          clearInterval(timerInterval);
          navigate('/speaking1', { state: { question: shuffledQuestions[0] } });
        }
        return prev > 0 ? prev - 1 : 0;
      });
    }, 1200);

    return () => clearInterval(timerInterval);
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
        <img src={Question1} alt="질문1" className="question-title" />
        <p className="question-text123">
          {shuffledQuestions.length > 0 ? shuffledQuestions[0] : "질문을 불러오는 중..."}
        </p>
        <p className="timer-text">
          <img src={Think} alt="생각하는 이미지" className="think-image1" />
        </p>
      </div>
      <div className="timer-circle">
        <svg className="circle-svg">
          <circle
            className="circle-background1"
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

export default Question;





import React, { useState, useEffect } from 'react';
import './second.css';
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
        <p className="question-text123">
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




import React, { useState, useEffect } from 'react';
import './third.css';
import { useNavigate } from 'react-router-dom';
import Question1 from './title_3.svg';
import Think from './think_1.svg';
import useShuffledQuestions from './Give'; // 커스텀 훅 import

function Question3() {
  const [progress, setProgress] = useState(68);
  const [timeLeft, setTimeLeft] = useState(5);
  const navigate = useNavigate();
  const shuffledQuestions = useShuffledQuestions(); // 커스텀 훅 사용

  useEffect(() => {
    if (shuffledQuestions.length < 3) return; // 세 번째 질문이 있는지 확인
    const target = 100;
    setTimeout(() => setProgress(target), 100);
    localStorage.setItem('q3', shuffledQuestions[2]);
    console.log('세 번째 질문 저장:', shuffledQuestions[2]);
  }, [shuffledQuestions]);

  useEffect(() => {
    if (shuffledQuestions.length < 3) return; // 세 번째 질문이 있는지 확인
    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 0) {
          clearInterval(timerInterval);
          navigate('/speaking3', { state: { question: shuffledQuestions[2] } });
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
        <img src={Question1} alt="질문3" className="question-title3" />
        <p className="question-text2">
          {shuffledQuestions.length > 2 ? shuffledQuestions[2] : "질문을 불러오는 중..."}
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

export default Question3;



