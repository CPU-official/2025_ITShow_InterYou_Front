import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './ModalNotification.css';
import Warning from './Warning.jsx';

// ------------------- ✨ 백엔드 연결 ✨ -------------------
const API_BASE_URL = "http://3.39.189.31:3000";

function Information_2({ onClose }) {
  const [agree, setAgreed] = useState(false);
  const checkBoxChange = (e) => {
    setAgreed(e.target.checked);
  };

  const [name, setName] = useState("");
  const onChange = (e) => {
    setName(e.target.value);
  };

  // 경고 모달 상태 관리
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningModalImage, setWarningModalImage] = useState('');

  const navigate = useNavigate();

  // 경고 모달 표시 함수
  const showCustomWarning = (imagePath) => {
    setWarningModalImage(imagePath);
    setShowWarningModal(true);
  };

  // 경고 모달 닫기 함수
  const closeCustomWarning = () => {
    setShowWarningModal(false);
    setWarningModalImage('');
  };

  // 테스트 시작하기 버튼
  const testButtonClick = async () => { // <--- async 키워드 추가
    if (!agree) {
      showCustomWarning('/img/info_alert_check.svg');
      console.log("체크없음")
      return;
    }

    // ------------------- ✨ 이름 API 시작 ✨ -------------------
    if (name.trim() === "") { // 이름이 비어있는지 확인
      showCustomWarning('/img/test.png');
      console.log("이름 빔");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/`, {
        method: "POST", // 데이터를 생성하므로 POST 메서드 사용
        headers: {
          "Content-Type": "application/json", // JSON 형식으로 데이터를 보낸다고 명시
        },
        body: JSON.stringify({ name: name }), // 사용자가 입력한 이름을 JSON 문자열로 변환하여 전송
      });

      if (!response.ok) {
        const errorData = await response.json();
        // HTTP 상태 코드에 따라 다른 오류 메시지 표시
        if (response.status === 409) {
          showCustomWarning('/img/info_alert_duplication.svg'); // 중복 이름 알림
          console.log("이름 중복임")
        }
        throw new Error(errorData.detail || "이름 저장 실패");
      }

      const data = await response.json();
      console.log("이름 저장 성공:", data);
      localStorage.setItem("name", name);
      console.log("로컬 저장 성공!")
      // 성공적으로 저장되면 다음 페이지로 이동
      navigate("/question");

    } catch (error) {
      console.error("이름 저장 중 오류 발생:", error);
    }
  }; // ----------------------이름 API 끝--------------------------- 

  return (
    <div className="modalOvelay" onClick={onClose}>
      <div className="modalMain" onClick={(e) => e.stopPropagation()}>
        <div className="alltext">
          <div className="textbox1">
            <p id="text1">촬영 동의</p>
            <p id="text2">*</p>
          </div>
          <div className="checkboxRow">
            <span id="text3">
              촬영 중 자신의 모습이 녹화되는 것에 동의합니다.
            </span>
            <input
              id="checkBox"
              type="checkbox"
              checked={agree}
              onChange={checkBoxChange}
            />
          </div>

          <div className="textbox1">
            <p id="text1">이름</p>
            <p id="text2">*</p>
          </div>
          <input
            id="namePlace"
            name="name"
            placeholder="이름 입력"
            onChange={onChange}
            value={name}
          />
          <button className="testStartButton" onClick={testButtonClick}>
            <p id="testStartText">테스트 시작하기</p>
          </button>
        </div>
      </div>
      {/* 경고 모달 조건부 렌더링 */}
      {showWarningModal && (
        <Warning
          imageUrl={warningModalImage}
          onClose={closeCustomWarning}
        />
      )}
    </div>
  );
}

export default Information_2;