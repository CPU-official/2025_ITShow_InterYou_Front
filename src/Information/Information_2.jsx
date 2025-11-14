import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './ModalNotification.css';
import Warning from './Warning.jsx';
import Complete from "./Complete.jsx";

// ------------------- ✨ 백엔드 연결 ✨ -------------------
const API_BASE_URL = "https://interyou.mirim-it-show.site/api";

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

  // Complete 모달 상태 관리
  const [showCompleteModal, setShowCompleteModal] = useState(false);

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

  // Complete 모달 표시 함수
  const showComplete = () => {
    setShowCompleteModal(true);
  };

  // Complete 모달에서 '확인' 버튼 클릭 시 호출될 함수
  const handleCompleteConfirm = () => {
    setShowCompleteModal(false); // Complete 모달 닫기
    navigate("/question1"); // 다음 페이지로 이동
  };

  // 테스트 시작하기 버튼
  const testButtonClick = async () => {
    if (!agree) {
      showCustomWarning('/img/info_alert_check.svg');
      console.log("체크없음");
      return;
    }

    else if (name.trim() === "") {
      showCustomWarning('/img/info_alert_name.svg');
      console.log("이름 빔");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409) {
          showCustomWarning('/img/info_alert_duplication.svg');
          console.log("이름 중복임");
        }
        throw new Error(errorData.detail || "이름 저장 실패");
      }

      else {
        const data = await response.json();
        console.log("이름 저장 성공:", data);
        localStorage.setItem("name", name);
        console.log("로컬 저장 성공!");

        // 이름 저장 성공 시 Complete 모달 표시
        showComplete();
      }

    } catch (error) {
      console.error("이름 저장 중 오류 발생:", error);
    }
  };

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
          // ✨ 추가: showWarningModal 상태를 isOpen prop으로 전달합니다. ✨
          isOpen={showWarningModal}
        />
      )}
      {/* Complete 모달 조건부 렌더링 추가 */}
      {showCompleteModal && (
        <Complete
          // Complete 모달의 '확인' 버튼 클릭 시 호출될 함수를 props로 전달
          onConfirm={handleCompleteConfirm}
          // ✨ 추가: showCompleteModal 상태를 isOpen prop으로 전달합니다. ✨
          isOpen={showCompleteModal}
        />
      )}
    </div>
  );
}

export default Information_2;
