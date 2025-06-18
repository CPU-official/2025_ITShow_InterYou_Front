import React, { useEffect, useRef } from 'react';
import './answerLoading.css';
import { useNavigate } from 'react-router-dom';

function AnswerLoading() {
  const navigate = useNavigate();
  const didRun = useRef(false); // useEffect 중복 방지

  const q1 = localStorage.getItem("q1");
  const q1_answer = localStorage.getItem("q1_answer");
  const q2 = localStorage.getItem("q2");
  const q2_answer = localStorage.getItem("q2_answer");
  const q3 = localStorage.getItem("q3");
  const q3_answer = localStorage.getItem("q3_answer");

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    const sendToAI = async () => {
      try {
        const response = await fetch("http://localhost:8000/analyze_answers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            question1: q1,
            answer_text1: q1_answer,
            question2: q2,
            answer_text2: q2_answer,
            question3: q3,
            answer_text3: q3_answer,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("분석 실패:", errorData.detail);
          return;
        }

        const result = await response.json();
        console.log("AI 분석 결과:", result);
        navigate("/resultScroll", { state: { feedback: result } });

      } catch (error) {
        console.error("API 호출 중 오류 발생:", error);
      }
    };

    sendToAI();
  }, [navigate]);

  return (
    <div className="answer-loading-container">
      <div className="answer-loading-card">
        <div className="answer-loading-title">
          AI가 답변을 분석하는 중이에요!
        </div>
        <div className="answer-loading-wait">
          분석이 끝나면 결과창으로 이동합니다!
        </div>
      </div>
      <img src="/Loading.gif" className="answer-loading-gif" alt="load" />
    </div>
  );
}

export default AnswerLoading;
