import whisper
import io
import os
import tempfile
from fastapi import FastAPI, UploadFile, File, HTTPException, status
from pydantic import BaseModel
import uvicorn
import asyncio
from fastapi.middleware.cors import CORSMiddleware
import time
import numpy as np # ✨ numpy 추가 ✨
import soundfile as sf # ✨ soundfile 추가 ✨

# FastAPI 애플리케이션 인스턴스 생성
app = FastAPI(
    title="음성 인식 API",
    description="Whisper 모델을 사용하여 사용자가 업로드한 음성을 텍스트로 변환하는 API입니다.",
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
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 전역 변수로 모델을 저장하여 한 번만 로드하도록 합니다.
whisper_model = None
model_loaded = False

# 애플리케이션 시작 시 모델 로드
@app.on_event("startup")
async def load_model_on_startup():
    global whisper_model, model_loaded
    print("모델 로딩 중...")
    start_time = time.time()
    try:
        # 모델 로딩 시간 단축을 위해 tiny 또는 base 모델 고려 (성능 vs 정확도)
        # 예시에서는 medium을 유지하되, 필요시 변경 가능
        whisper_model = whisper.load_model("medium")
        model_loaded = True
        end_time = time.time()
        loading_duration = end_time - start_time
        print(f"모델 로딩 완료! 총 {loading_duration:.2f}초 소요되었습니다.")
        print("Whisper 모델이 성공적으로 준비되었습니다.")
    except Exception as e:
        print(f"모델 로딩 중 오류 발생: {e}")
        # 모델 로딩 실패 시 애플리케이션 시작을 중단하거나, 경고를 명확히 표시
        # 여기서는 모델이 로드되지 않았음을 알리는 상태를 유지합니다.

class TranscribeResponse(BaseModel):
    transcribed_text: str

@app.get("/", summary="API 상태 확인")
async def read_root():
    """
    API 서버의 상태를 확인합니다. Whisper 모델의 로드 상태를 반환합니다.
    """
    if model_loaded:
        return {"message": "음성 인식 API 서버가 실행 중입니다. Whisper 모델이 성공적으로 로드되었습니다."}
    else:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Whisper 모델이 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요."
        )

@app.post("/transcribe_audio_file", response_model=TranscribeResponse, summary="음성 파일 업로드 및 텍스트 변환")
async def transcribe_audio_file(audio_file: UploadFile = File(...)):
    """
    사용자가 녹음한 음성 파일을 업로드하면 Whisper 모델을 사용하여 텍스트로 변환합니다.

    - **`audio_file`**: 녹음된 오디오 파일 (MP3, WAV, FLAC 등 Whisper가 지원하는 형식).
      권장 오디오 길이는 10초 내외입니다.

    **참고:** Whisper 모델은 다양한 오디오 형식을 지원하지만, 최상의 결과를 위해
    16kHz, 모노 채널 WAV 또는 FLAC 파일을 권장합니다.
    """
    if not model_loaded:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Whisper 모델이 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요."
        )

    if not audio_file.content_type.startswith('audio/'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="업로드된 파일이 오디오 형식이 아닙니다. 오디오 파일을 업로드해주세요."
        )

    print(f"\n파일 수신: {audio_file.filename} ({audio_file.content_type})")

    # 임시 파일에 오디오 데이터를 저장
    # Whisper 모델은 파일 경로를 직접 받거나 numpy 배열을 받을 수 있습니다.
    # 여기서는 파일 경로를 사용하는 것이 메모리 효율성 면에서 유리할 수 있습니다.
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_audio_file:
        try:
            # 클라이언트가 업로드한 파일 스트림을 임시 파일에 직접 씁니다.
            file_content = await audio_file.read()
            temp_audio_file.write(file_content)
            temp_audio_file_path = temp_audio_file.name
        except Exception as e:
            print(f"파일 쓰기 중 오류 발생: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"파일을 처리하는 중 오류가 발생했습니다: {e}"
            )
    
    transcribed_text = ""
    try:
        # Whisper transcribe 또한 동기 방식으로 작동하므로, 비동기 컨텍스트에서 실행
        loop = asyncio.get_event_loop()
        
        print("음성 인식 처리 중...")
        result_start_time = time.time()

        # Whisper 모델은 파일 경로를 직접 처리할 수 있습니다.
        # 또는 soundfile을 사용하여 numpy 배열로 로드 후 transcribe할 수도 있습니다.
        # 여기서는 파일 경로를 직접 사용하는 방법을 선호합니다.
        result = await loop.run_in_executor(
            None,
            lambda: whisper_model.transcribe(temp_audio_file_path, language="ko")
        )
        
        result_end_time = time.time()
        transcribe_duration = result_end_time - result_start_time
        print(f"음성 인식 처리 완료! 총 {transcribe_duration:.2f}초 소요되었습니다.")

        transcribed_text = result["text"].strip()
        print("최종 인식 결과:", transcribed_text)
        print("-" * 50)
        return TranscribeResponse(transcribed_text=transcribed_text)

    except Exception as e:
        print(f"음성 파일 처리 및 인식 중 오류 발생: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"음성 파일 인식 중 오류가 발생했습니다: {e}"
        )
    finally:
        # 임시 파일 정리 (오류 발생 시에도 반드시 삭제)
        if os.path.exists(temp_audio_file_path):
            os.remove(temp_audio_file_path)
            print(f"임시 파일 삭제됨: {temp_audio_file_path}")

# 서버 실행
if __name__ == "__main__":
    # 운영 환경에서는 reload=True를 제거해야 합니다.
    uvicorn.run("recording:app", host="0.0.0.0", port=8000, reload=True)
    # 'your_module_name'을 이 스크립트의 실제 파일명으로 바꿔주세요 (예: main.py -> "main:app")