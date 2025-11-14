import React, { useState, useEffect } from "react";
import "./RankingPage.css";
import Logo from './logo.svg';
import onest from './1.svg';
import twost from './2.svg';
import threest from './3.svg';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD

=======
>>>>>>> d361e804a97393eded228d32c47f19ef1f3a7c00

const RankingPage = () => {
  const [rankingData, setRankingData] = useState([]);
  const [topRankers, setTopRankers] = useState({
    gold: { name: '', score: 0 },
    silver: { name: '', score: 0 },
    bronze: { name: '' , score: 0}
  });

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await fetch("https://interyou.mirim-it-show.site/api/ranking/");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setRankingData(data.users);

        // 상위 3명 설정
        if (data.users.length > 0) {
          setTopRankers(prevState => ({
            ...prevState,
            gold: data.users[0] || { name: 'N/A', score: 0 }
          }));
        }
        if (data.users.length > 1) {
          setTopRankers(prevState => ({
            ...prevState,
            silver: data.users[1] || { name: 'N/A', score: 0 }
          }));
        }
        if (data.users.length > 2) {
          setTopRankers(prevState => ({
            ...prevState,
            bronze: data.users[2] || { name: 'N/A', score: 0 }
          }));
        }

      } catch (error) {
        console.error("랭킹 데이터를 가져오는 데 실패했습니다:", error);
      }
    };

    fetchRanking();
  }, []);
  const navigate = useNavigate(); // 
  const handleRankingClick1 = () => {
    console.log("랭킹 버튼 클릭됨");
    navigate('/'); 
  };
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
          <div className="podium-name2">{topRankers.silver.name}</div>
        </div>
        <div className="podium gold">
          <img src={onest} alt="1등" className="medal"/>
          <div className="podium-name1">{topRankers.gold.name}</div>
        </div>
        <div className="podium bronze">
          <img src={threest} alt="3등" className="medal"/>
          <div className="podium-name3">{topRankers.bronze.name}</div>
        </div>
      </div>

      <div className="ranking-list-box"> {/* 랭킹 목록을 담을 박스 */}
        <div className="ranking-list-header">
          <div className="rank-header">순위</div>
          <div className="name-header">이름</div>
          <div className="score-header">점수</div>
        </div>
        {rankingData.map((user, index) => (
          <div key={index} className="ranking-item">
            <div className="rank">{index + 1}</div>
            <div className="name">{user.name}</div>
            <div className="score">{user.score}</div>
          </div>
        ))}
      </div>
      <button className="first button" onClick={handleRankingClick1}>처음으로</button>
    </div>
  );
};

export default RankingPage;