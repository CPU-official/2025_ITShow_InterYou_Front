import React, { useState, useEffect, useRef } from 'react';
import './SpeakingAll.css';
import { useNavigate, useLocation } from 'react-router-dom';
import Question1 from '../Question/title_2.svg';
import Think from './answer_1.svg';

function Speaking2() {
  const location2 = useLocation();
  const question2 = location2.state?.question || "질문이 없습니다.";
  const [progress] = useState(67);
  const [timeLeft, setTimeLeft] = useState(10); // 타이머 초기값
  const navigate = useNavigate();
  const [isRecordingDone, setIsRecordingDone] = useState(false); // 녹음 완료 상태 추가
  const [isRecording, setIsRecording] = useState(false); // 녹음 시작 상태 추가

  const mediaRecorderRef = useRef(null); // MediaRecorder 인스턴스를 저장할 ref
  const audioChunksRef = useRef([]); // 오디오 청크를 저장할 ref
  const startTimeRef = useRef(0); // 녹음 시작 시간을 저장할 ref (타이머 기준)


  useEffect(() => {
    let timerInterval;
    const startRecording = async () => {
      try {
        // 마이크 접근 요청
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = []; // 새로운 녹음 시작 전에 청크 초기화

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = () => {
          console.log("녹음이 중지되었습니다.");
          setIsRecordingDone(true); // 녹음 완료 상태 업데이트
          // 스트림 트랙 중지 (마이크 아이콘 사라짐)
          stream.getTracks().forEach(track => track.stop());
        };
        mediaRecorderRef.current.start();
        setIsRecording(true); // 녹음 시작 상태
        console.log("녹음 시작!");

        // 타이머 시작 시간 기록
        startTimeRef.current = Date.now();

        // 타이머 시작
        timerInterval = setInterval(() => {
          // 현재 시간과 시작 시간의 차이를 계산하여 경과 시간 측정
          const elapsedTime = Math.floor((Date.now() - startTimeRef.current) / 1000);
          const remainingTime = 10 - elapsedTime; // 총 10초에서 경과 시간 기

          setTimeLeft(Math.max(0, remainingTime)); // 남은 시간이 0보다 작아지지 않도록 보정

          if (remainingTime < 0) {
            clearInterval(timerInterval); // 타이머가 0이 되면 인터벌 클리어
            if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
              mediaRecorderRef.current.stop(); // 녹음 중지
            }
          }
        }, 100); // 100ms마다 체크하여 더 부드러운 업데이트 (선택 사항, 1000ms도 가능)

      } catch (err) {
        console.error("마이크 접근 오류:", err);
        alert("마이크 접근 권한이 필요합니다. 브라우저 설정에서 허용해주세요.");
        setIsRecording(false); // 녹음 시작 실패
        setIsRecordingDone(true); // 오류 발생 시에도 진행을 위해 녹음 완료 상태로 설정 (다른 에러 처리 고려)
        setTimeLeft(0); // 오류 발생 시 타이머도 0으로 설정
        clearInterval(timerInterval); // 혹시 모를 타이머 클리어
      }
    };

    // 컴포넌트 마운트 시 자동으로 녹음 시작
    startRecording();

    // 컴포넌트 언마운트 시 클린업
    return () => {
      clearInterval(timerInterval); // 타이머 정리
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop(); // 녹음 중이면 중지
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop()); // 스트림 정리
      }
    };
  }, []); // 빈 의존성 배열로 컴포넌트 마운트 시 한 번만 실행

  // 녹음 완료 상태(isRecordingDone)가 true가 되면 다음 페이지로 오디오 Blob 전달
  useEffect(() => {
    if (isRecordingDone && audioChunksRef.current.length > 0) {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      console.log("녹음된 오디오 Blob:", audioBlob);

      // 다음 페이지로 오디오 Blob을 state로 전달
      navigate('/recordLoading', {
        state: {
          recordedAudioBlob: audioBlob,
          question: question2,
          nextPage: '/question3',
          answerName: 'q2_answer'
        }
      });
    } else if (isRecordingDone && audioChunksRef.current.length === 0 && !isRecording) {
      // 녹음 시작조차 안 된 상태에서 isRecordingDone이 true가 된 경우 (예: 마이크 권한 거부)
      console.warn("녹음된 오디오 데이터가 없어 다음 페이지로 넘어갑니다.");
      navigate('/recordLoading',
        {
          state:
          {
            question: question2,
            nextPage: '/question3',
            answerName: 'q2_answer'
          }
        });
    }
  }, [isRecordingDone, navigate, question2, isRecording]);




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
                transition: "background 0.7s cubic-bezier(.4,2,.6,1)"
              }}
            />
          ))}
        </div>
      </div>
      <div className="question-box">
        <img src={Question1} alt="질문2" className="question-title2" />
        <p className="question-text2">{question2}</p>
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
            strokeDasharray={circleCircumference}
            strokeDashoffset={circleCircumference * (timeLeft / 10)} // 10초
          ></circle>
        </svg>
        <span className="timer-number1">{timeLeft}</span>
      </div>
    </div>
  );
}

export default Speaking2;