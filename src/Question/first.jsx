import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './first.css';
import Question1 from './title_1.svg';
import Think from './think_1.svg';
import doc from './Ellipse.svg';
function Question() {
  
  const [progress, setProgress] = useState(0); // 0%에서 시작!  
  const [timeLeft, setTimeLeft] = useState(5); // 타이머 초기값
  const navigate = useNavigate();

  useEffect(() => {
    // 진행바 하이라이팅 효과
    const target = 34 ; // 목표 퍼센트 (페이지별로 25, 50, 75, 100 등)
    setTimeout(() => setProgress(target), 100); // 0.1초 후 애니메이션 시작
  }, []);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 0) {
          clearInterval(timerInterval); 
          navigate('/speaking'); // 타이머 종료 후 페이지 이동 
        }
        return prev > 0 ? prev - 1 : 0; // 타이머 감소
      }); 
    }, 1300);

    return () => {
      clearInterval(timerInterval); // 컴포넌트 언마운트 시 타이머 정리
    };  
  }, [navigate]);

  const circleRadius = 110; // 반지름   
  const circleCircumference = 2 * Math.PI * circleRadius; // 원 둘레

  return (
<div className="start-container">
      <div className="progress-bar">
        <div
          className="progress"
          style={{ width: `${progress}%`, transition: 'width 1s ease-in-out' }}
        ></div>
         <div className="progress-dots">
          <img src={doc} alt="docc" className='dot1'/>
          <img src={doc} alt="docc" className='dot2'/>
          <img src={doc} alt="docc" className='dot3'/>
          <img src={doc} alt="docc" className='dot4'/>
  </div>
      </div>
         <div className="question-box">
        <img src={Question1} alt="질문1" className="question-title" />
        <p className="question-text">맨홀 뚜껑은 왜 원형일까요?</p>
        <p className="timer-text">
          <img src={Think} alt="생각하는 이미지" className="think-image" />
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
            // timeLeft가 줄어들수록 strokeDashoffset이 커지게!
            strokeDashoffset: circleCircumference * (1+timeLeft / 5),
            }}
          ></circle>
        </svg>
        <span className="timer-number">{timeLeft}</span>
      </div>
    </div>
  );
}

export default Question;  