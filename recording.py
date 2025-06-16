# post get 분리 안함

import sounddevice as sd
import numpy as np
import whisper
import io
import os
from fastapi import FastAPI, UploadFile, File, HTTPException, status
from pydantic import BaseModel
import uvicorn
import asyncio
import tempfile
from fastapi.middleware.cors import CORSMiddleware
import time # ✨ time 모듈 추가 ✨


# FastAPI 애플리케이션 인스턴스 생성
app = FastAPI(
    title="음성 인식 API",
    description="Whisper 모델을 사용하여 음성을 텍스트로 변환하는 API입니다.",
    version="1.0.0"
)


# --- CORS 설정 ---
origins = [
    "http://3.39.189.31:3000",
    "http://localhost",
    "http://localhost:5501",
    "http://127.0.0.1",
    "http://127.0.0.1:5501",
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "http://127.0.0.1:8000",
    "http://localhost:8000",
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    "null"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# 전역 변수로 모델을 저장하여 한 번만 로드하도록 합니다.
# 모델 로딩은 시간이 오래 걸리므로, 서버 시작 시점에 로드합니다.
whisper_model = None


# 모델 로딩 상태를 나타내는 변수
model_loaded = False


# 애플리케이션 시작 시 모델 로드
@app.on_event("startup")
async def load_model_on_startup():
    global whisper_model, model_loaded
    print("모델 로딩 중...")
    start_time = time.time() # ✨ 로딩 시작 시간 기록 ✨
    try:
        whisper_model = whisper.load_model("medium")
        model_loaded = True
        end_time = time.time() # ✨ 로딩 종료 시간 기록 ✨
        loading_duration = end_time - start_time
        print(f"모델 로딩 완료! 총 {loading_duration:.2f}초 소요되었습니다.") # ✨ 소요 시간 출력 ✨
        print("Whisper 모델이 성공적으로 준비되었습니다.") # ✨ 로딩 완료 시점 명확히 출력 ✨
    except Exception as e:
        print(f"모델 로딩 중 오류 발생: {e}")
        # 모델 로딩 실패 시 애플리케이션 시작을 막거나, 오류를 기록할 수 있습니다.
        # 여기서는 단순히 오류 메시지를 출력합니다.


class TranscribeResponse(BaseModel):
    transcribed_text: str


@app.get("/", summary="API 상태 확인")
async def read_root():
    """
    API 서버의 상태를 확인합니다.
    """
    if model_loaded:
        return {"message": "음성 인식 API 서버가 실행 중입니다. 모델이 로드되었습니다."}
    else:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="모델이 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요."
        )


@app.post("/transcribe_live", response_model=TranscribeResponse, summary="라이브 음성 인식 (10초 녹음)")
async def transcribe_live_audio(duration: int = 10, fs: int = 16000):
    """
    서버가 10초 동안 직접 음성을 녹음하여 텍스트로 변환합니다.
    **주의:** 이 엔드포인트는 서버가 마이크에 접근할 수 있어야 하며,
    서버 환경에 따라 녹음 장치 설정이 필요할 수 있습니다.
    실제 배포 환경에서는 클라이언트에서 오디오를 업로드하는 방식이 더 일반적입니다.
    """
    if not model_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Whisper 모델이 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요."
        )

    print(f"\n녹음 시작 ({duration}초)...")
    try:
        # sounddevice는 동기 방식으로 작동하므로, 비동기 컨텍스트에서 실행
        loop = asyncio.get_event_loop()
        audio = await loop.run_in_executor(
            None, # 기본 ThreadPoolExecutor 사용
            lambda: sd.rec(int(duration * fs), samplerate=fs, channels=1, dtype='int16')
        )

        await loop.run_in_executor(None, sd.wait) # 녹음이 끝날 때까지 기다림
        print("녹음 완료")

        audio_np = audio.flatten().astype(np.float32) / 32768.0
        print("음성 인식 처리 중...") # ✨ 인식 처리 시작 시점 출력 ✨

        # Whisper transcribe 또한 동기 방식으로 작동
        result_start_time = time.time() # ✨ 인식 시작 시간 기록 ✨
        result = await loop.run_in_executor(
            None,
            lambda: whisper_model.transcribe(audio_np, language="ko")
        )
        result_end_time = time.time() # ✨ 인식 종료 시간 기록 ✨
        transcribe_duration = result_end_time - result_start_time
        print(f"음성 인식 처리 완료! 총 {transcribe_duration:.2f}초 소요되었습니다.") # ✨ 인식 소요 시간 출력 ✨


        transcribed_text = result["text"].strip()
        print("최종 인식 결과:", transcribed_text) # ✨ 최종 결과 명확히 출력 ✨
        print("-" * 50)
        return TranscribeResponse(transcribed_text=transcribed_text)
    except Exception as e:
        print(f"라이브 녹음 및 인식 중 오류 발생: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"음성 인식 중 오류가 발생했습니다: {e}"
        )


# 서버 실행
if __name__ == "__main__":
    uvicorn.run("recording:app", host="0.0.0.0", port=8000, reload=True)