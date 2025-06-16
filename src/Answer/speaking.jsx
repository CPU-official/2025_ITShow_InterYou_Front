import React, { useState, useEffect } from 'react';
import './speaking.css';
import { useNavigate, useLocation } from 'react-router-dom';
import Question1 from '../Question/title_1.svg';
import Think from './answer_1.svg';

function Speaking() {
  const location = useLocation();
  const question = location.state?.question || "질문이 없습니다.";
  const [progress] = useState(34);
  const [timeLeft, setTimeLeft] = useState(10); // 타이머 초기값
  const navigate = useNavigate();
  const [isRecordingDone, setIsRecordingDone] = useState(false); // 녹음 완료 상태 추가

  useEffect(() => {
    // 타이머 인터벌 설정
    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev > 0) {
          return prev - 1;
        } else {
          // 타이머가 0이 되면 인터벌 중지 및 녹음 완료 상태 설정
          clearInterval(timerInterval);
          setIsRecordingDone(true); // 녹음 완료
          return 0;
        }
      });
    }, 1000); // 1초마다 감소하도록 수정 (원래 1200ms -> 1000ms)

    return () => {
      clearInterval(timerInterval); // 컴포넌트 언마운트 시 타이머 정리
    };
  }, []); // 빈 의존성 배열로 컴포넌트 마운트 시 한 번만 실행

  // isRecordingDone 상태가 true가 되면 음성 인식 API 호출
  useEffect(() => {
    if (isRecordingDone) {
      console.log("10초 녹음이 완료되었습니다. 음성 인식 API를 호출합니다...");
      const transcribeAudio = async () => {
        try {
          // FastAPI 서버의 transcribe_live 엔드포인트 호출
          // 'http://127.0.0.1:8000'는 FastAPI 서버가 실행되는 주소에 맞게 변경하세요.
          // 현재 FastAPI 코드에서는 duration=12로 설정되어 있으나, 클라이언트에서 직접 녹음하는 것이 아니므로
          // 이 엔드포인트를 호출하면 서버가 자체적으로 12초간 녹음합니다.
          const response = await fetch('http://127.0.0.1:8000/transcribe_live', {
            method: 'POST', // FastAPI에서 POST로 정의되어 있으므로 POST 사용
            headers: {
                'Content-Type': 'application/json',
            },
            // 'duration' 파라미터는 쿼리 파라미터로 넘겨도 되지만, 여기서는 서버 기본값(12초)을 따릅니다.
            // 만약 클라이언트에서 10초를 명시하고 싶다면:
            // const response = await fetch('http://127.0.0.1:8000/transcribe_live?duration=10', { ... });
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log("음성 인식 결과:", data.transcribed_text); // 인식된 텍스트 콘솔 출력

          // 음성 인식 완료 후 다음 페이지로 이동
          navigate('/question2');

        } catch (error) {
          console.error("음성 인식 API 호출 중 오류 발생:", error);
          // 오류 발생 시에도 다음 페이지로 이동하거나, 사용자에게 알림을 줄 수 있습니다.
          navigate('/question2'); // 오류 시에도 일단 다음 페이지로 이동하도록 설정
        }
      };

      transcribeAudio();
    }
  }, [isRecordingDone, navigate]); // isRecordingDone이 변경될 때만 실행

  const circleRadius = 110; // 반지름
  const circleCircumference = 2 * Math.PI * circleRadius; // 원 둘레

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
        <p className="question-text2">{question}</p>
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
              // 10초 타이머에 맞춰 strokeDashoffset 계산 수정
              strokeDashoffset: circleCircumference * (timeLeft / 10),
            }}
          ></circle>
        </svg>
        <span className="timer-number1">{timeLeft}</span>
      </div>
    </div>
  );
}

export default Speaking;