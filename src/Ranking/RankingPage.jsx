import React from "react";
import "./RankingPage.css";
import Logo from './logo.svg'
import onest from './1.svg';
import twost from './2.svg';
import threest from './3.svg';


const RankingPage = () => {
  return (
    <div className="ranking-bg">
      <header className="ranking-header">
        <div className="ranking-logo">
          <img src={Logo} alt="로고" className="logo-main" />
        </div>
        <div className="ranking-title">전체 랭킹</div>
      </header>
<div className="podium-container">
  <div className="podium silver">
    <img src={twost} alt="2등" className="medal"/>
    <div className="podium-name2">육준성</div>
  </div>
  <div className="podium gold">
    <img src={onest} alt="1등" className="medal"/>
    <div className="podium-name1">전유림</div>
  </div>
  <div className="podium bronze">
    <img src={threest} alt="3등" className="medal"/>
    <div className="podium-name3">이민준</div>
  </div>
</div>

    </div>
  );
};

export default RankingPage;
