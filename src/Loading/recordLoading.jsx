import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './recordLoading.css';

function RecordLoading() {
    const location = useLocation();
    const navigate = useNavigate();
    const recordedAudioBlob = location.state?.recordedAudioBlob;
    const question = location.state?.question;
    const nextPage = location.state?.nextPage;  // 다음 페이지 URL
    const answerName = location.state?.answerName;  // 로컬에 저장할 이름
    console.log(nextPage, answerName);

    const [transcribedText, setTranscribedText] = useState('');
    const [isLoading, setIsLoading] = useState(true); // 초기값 true
    const [error, setError] = useState(null);

    const backendApiUrl = 'http://127.0.0.1:8000/transcribe_audio_file';

    // API 호출 상태를 추적하는 useRef 추가
    // 이 훅은 컴포넌트 리렌더링과 무관하게 값을 유지합니다.
    const hasFetchedRef = useRef(false);

    useEffect(() => {
        const sendAudioToBackend = async () => {
            // ✨ 여기서 핵심적인 변경! ✨
            // 이미 API 호출을 시작했거나 (isLoading이 true), 
            // 이전에 한 번 성공적으로 호출했다면 (hasFetchedRef.current가 true),
            // 다시 호출하지 않도록 방어합니다.
            if (isLoading && hasFetchedRef.current) {
                return; // 이미 호출 중이면 다시 호출하지 않음
            }

            if (!recordedAudioBlob) {
                console.error('오디오 데이터가 없어 음성 인식을 시작할 수 없습니다.');
                setError('녹음된 오디오 데이터를 찾을 수 없습니다.');
                setIsLoading(false);
                return;
            }

            // API 호출을 시작하기 전에 플래그를 true로 설정
            hasFetchedRef.current = true; // ✨ 여기 추가 ✨

            setIsLoading(true);
            setError(null);
            console.log('음성 인식 API 호출 시작...');

            try {
                const formData = new FormData();
                formData.append('audio_file', recordedAudioBlob, 'recording.wav');

                const response = await fetch(backendApiUrl, {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(`API 오류: ${errorData.detail || response.statusText}`);
                }

                const data = await response.json();
                const receivedText = data.transcribed_text.trim();
                setTranscribedText(receivedText);
                console.log("음성 인식 결과:", receivedText);
                localStorage.setItem(answerName, receivedText);


                // 성공적으로 처리되면 다음 페이지로 이동 
                navigate(nextPage, {
                    state: {
                        transcribedText: receivedText,
                        originalQuestion: question
                    }
                });

            } catch (err) {
                console.error('음성 인식 API 호출 중 오류 발생:', err);
                setError(`음성 인식 실패: ${err.message}`);
                // 오류 발생 시에도 사용자에게 알리고 다음 페이지로 이동
                navigate('/information', {
                    state: {
                        errorMessage: err.message,
                        originalQuestion: question
                    }
                });
            } finally {
                setIsLoading(false); // 호출 완료 (성공이든 실패든)
            }
        };

        // 컴포넌트 마운트 시에만 API 호출 함수 실행
        // StrictMode 때문에 두 번 호출되더라도 hasFetchedRef로 한 번만 실행되도록 방어
        if (!hasFetchedRef.current) { // ✨ 여기도 추가 ✨
            sendAudioToBackend();
        }

    }, [recordedAudioBlob, question, answerName, nextPage, navigate, isLoading]); // isLoading을 의존성 배열에 추가 (hasFetchedRef를 조건으로 사용하므로)

    return (
        <div className="record-loading-container">
            {isLoading ? (
                <>
                    <div className='answer-loading-card'>
                        <h1 className="loading-title">음성을 분석 중입니다...</h1>
                        <p className="loading-text">잠시 후 다음 질문이 나타납니다!</p>
                    </div>
                    <div className="spinner"></div>
                </>
            ) : (
                <>
                    {error ? (
                        <>
                            <h1 className="error-title">오류 발생!</h1>
                            <p className="error-message">{error}</p>
                            <button onClick={() => navigate('/')}>처음으로 이동</button>
                        </>
                    ) : (
                        <>
                            <h1 className="success-title">분석 완료!</h1>
                            <p className="result-preview">인식된 텍스트: {transcribedText}</p>
                            <p className="redirect-message">잠시 후 다음 질문으로 이동합니다...</p>
                        </>
                    )}
                </>
            )}
        </div>
    );
}

export default RecordLoading;