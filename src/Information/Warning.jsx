import React from 'react';
import './Warning.css'; 

function Warning({ imageUrl, onClose }) {
  return (
    <div className="warning-modal-overlay" onClick={onClose}>
      <div className="warning-modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={imageUrl} />
        {/* 이미지 클릭 시 닫히도록 하려면 아래 줄의 주석을 해제하세요. */}
        <button className="close-button" onClick={onClose}>확인</button> 
      </div>
    </div>
  );
}

export default Warning;