import { useNavigate } from "react-router-dom"; // 추가
import React, { useEffect } from 'react'; 
import "./Main_Page.css"; 
import name from "./main_logo.png"; 

const Main_Page = () => {
  const navigate = useNavigate(); // 추가
  useEffect(() => {
    // 프로그램 시작 시 기존 질문 세트 삭제
    localStorage.removeItem('pickedQuestions');
    localStorage.removeItem('q1');
    localStorage.removeItem('q2');
    localStorage.removeItem('q3');
  }, []);

  return (
    <div className="main-container">
      <div className="main-content">
          <img src={name} alt="로고" className="title" />
        <p className="main-description">당신의 순발력을 테스트해보세요!</p>
        <button
          className="start-button"
          onMouseOver={(e) => e.target.classList.add("hover")}
          onMouseOut={(e) => e.target.classList.remove("hover")}
          onClick={() => navigate("/information")} // 추가
        >
          시작하기 &gt;
        </button>
      </div>
    </div>
  );
};

export default Main_Page;