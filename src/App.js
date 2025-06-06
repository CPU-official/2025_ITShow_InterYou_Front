import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main_Page from "./MainPage/Main_Page"; // Main_Page 컴포넌트 가져오기
import Information from './Information/Information_1'; // Information 페이지
import Q1 from './Question/first';
import Speak from './Answer/speaking';
import React, { useState, useEffect } from 'react';
import AnswerLoading from './answerLoading/answerLoading';
import AnswerComplete from './answerComplete/answerComplete';
function App() {
  return (
    <Router>
      <Routes>

        {/* 메인 페이지 (기본 경로) /}
        <Route path="/" element={<Main_Page />} />

        {/ 팀원 2의 Information 페이지 /}
        <Route path="/information" element={<Information_1 />} />

        {/ 팀원 3의 질문 페이지/}
        {/ <Route path="/question" element={<Question />} /> /}
        {/ 팀원 3의 답변 페이지 /}
        { <Route path="/speaking" element={<Speaking />} /> /}

        {/ 팀원 4의 답변 대기 페이지 /}
        { <Route path="/answerLoading" element={<AnswerLoading />} />/}
        {/ 팀원 4의 답변 완료 페이지 /}
        { <Route path="/answerComplete" element={<AnswerComplete />} />*/}

      </Routes>
    </Router>
  );
}

export default App;