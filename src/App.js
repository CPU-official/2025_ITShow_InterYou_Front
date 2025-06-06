import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main_Page from "./MainPage/Main_Page"; // Main_Page 컴포넌트 가져오기
import Information from './Information/Information_1'; // Information 페이지

function App() {
  return (
    <Router>
      <Routes>
        {/* 메인 페이지 (기본 경로) /}
        <Route path="/" element={<Main_Page />} />

        {/ 팀원 2의 Information 페이지 /}
        <Route path="/information" element={<Information_1 />} />

        {/ 다른 팀원들의 페이지도 여기에 추가될 예정 /}
        {/ <Route path="/login" element={<LoginPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
