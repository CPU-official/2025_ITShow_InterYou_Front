import os
import json
import tempfile
import asyncio
import time
import whisper
import google.generativeai as genai
import numpy as np
import soundfile as sf
from fastapi import FastAPI, UploadFile, File, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv
import uvicorn

# .env 로드 및 Gemini 설정
load_dotenv()
gemini_api_key = os.getenv("GOOGLE_API_KEY")
if not gemini_api_key:
    raise ValueError("GEMINI_API_KEY 환경 변수가 설정되지 않았습니다.")
genai.configure(api_key=gemini_api_key)
gemini_model = genai.GenerativeModel(
    'gemini-1.5-flash',
    safety_settings=[
        {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
        {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
        {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
        {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
    ]
)

# FastAPI 앱 생성
app = FastAPI(
    title="InterYou 통합 백엔드",
    description="Gemini 분석 및 Whisper 음성 인식 기능을 통합 제공",
    version="2.0.0"
)

# CORS 설정
origins = [
    "http://3.39.189.31:3000",
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:5500",
    "http://localhost:5501",
    "http://127.0.0.1",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8000",
    "null"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Whisper 모델 전역 변수
whisper_model = None
model_loaded = False

# Whisper 모델 로드
@app.on_event("startup")
async def load_model_on_startup():
    global whisper_model, model_loaded
    try:
        whisper_model = whisper.load_model("medium")
        model_loaded = True
        print("Whisper 모델 로드 완료.")
    except Exception as e:
        print("Whisper 모델 로드 실패:", e)

# -------------------- 모델 정의 --------------------
class AspectScore(BaseModel):
    aspect: str
    score: float

class AnalyzeRequest(BaseModel):
    question1: str
    answer_text1: str
    question2: str
    answer_text2: str
    question3: str
    answer_text3: str

class AnalyzeResponse(BaseModel):
    answer1_comment: str
    answer1_detailed_score: list[AspectScore]
    answer2_comment: str
    answer2_detailed_score: list[AspectScore]
    answer3_comment: str
    answer3_detailed_score: list[AspectScore]
    total_score: float

class TranscribeResponse(BaseModel):
    transcribed_text: str
# --------------------------------------------------

# 루트 라우트
@app.get("/")
async def root():
    return {"message": "InterYou 백엔드 API가 실행 중입니다."}

# Gemini 기반 분석 API
@app.post("/analyze_answers", response_model=AnalyzeResponse)
async def analyze_answers(request: AnalyzeRequest):
    prompt = f"""당신은 AI 면접 심사위원입니다.
당신은 참가자의 답변 3개를 **창의성, 논리성** 기준으로 평가합니다.

---

### 평가 기준

1. **창의성 (Creativity):** 답변이 얼마나 독특하고 새로웠는지
2. **논리성 (Logic):** 답변이 얼마나 합리적이고 일관성 있는지를 평가

---

### 유의사항
참가자의 답변들은 **음성 인식 결과로, 일부 단어나 문장 구조가 부정확할 수 있습니다.**
발음 오류, 단어 생략, 이상한 문장 등 **음성 인식 특성에서 발생하는 오차를 감안하여**, 
참가자의 **의도와 전체적인 맥락**을 고려해 평가해 주세요.

---

### 참가자 답변

Q1: {request.question1}  
A1: {request.answer_text1}

Q2: {request.question2}  
A2: {request.answer_text2}

Q3: {request.question3}  
A3: {request.answer_text3}

---

### 평가 방식

- 각 답변에 대해 **창의성, 논리성** 점수를 부여합니다.
- 각 점수는 반드시 **10 단위 정수**여야 하며, 범위는 **30, 40, 50, ..., 100**입니다.
(예: 30, 40, 50, ..., 100 외의 숫자는 절대 사용하지 마세요)
- - **총점은 전체 6개 점수의 평균**이며, 소수점 둘째 자리까지 계산합니다.
---

### 결과 출력 형식 (이 형식 외 어떤 텍스트도 포함하지 마세요)

```json
{{
  "answer1_comment": "<답변에 대한 요약 피드백>",
  "answer1_detailed_score": [
    {{ "aspect": "창의성", "score": 90 }},
    {{ "aspect": "논리성", "score": 80 }}
  ],
  "answer2_comment": "<답변에 대한 요약 피드백>",
  "answer2_detailed_score": [
    {{ "aspect": "창의성", "score": 80 }},
    {{ "aspect": "논리성", "score": 80 }}
  ],
  "answer3_comment": "<답변에 대한 요약 피드백>",
  "answer3_detailed_score": [
    {{ "aspect": "창의성", "score": 70 }},
    {{ "aspect": "논리성", "score": 90 }}
  ],
  "total_score": 56.66
}}
"""
    try:
        response = gemini_model.generate_content(prompt)
        raw = response.text.strip()

        start = raw.find('{')
        end = raw.rfind('}') + 1
        if start == -1 or end == -1:
            raise ValueError("유효한 JSON을 찾을 수 없습니다.")

        json_string = raw[start:end]
        if json_string.startswith("```json"):
            json_string = json_string[7:].strip()
        if json_string.endswith("```"):
            json_string = json_string[:-3].strip()

        parsed = json.loads(json_string)
        return AnalyzeResponse(**parsed)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI 분석 중 오류: {e}")

# Whisper 음성 인식 API
@app.post("/transcribe_audio_file", response_model=TranscribeResponse)
async def transcribe_audio_file(audio_file: UploadFile = File(...)):
    if not model_loaded:
        raise HTTPException(status_code=503, detail="Whisper 모델이 아직 로드되지 않았습니다.")

    if not audio_file.content_type.startswith("audio/"):
        raise HTTPException(status_code=400, detail="오디오 파일만 업로드 가능합니다.")

    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
        file_data = await audio_file.read()
        temp_file.write(file_data)
        temp_path = temp_file.name

    try:
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(None, lambda: whisper_model.transcribe(temp_path, language="ko"))
        text = result["text"].strip()
        return TranscribeResponse(transcribed_text=text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"음성 인식 실패: {e}")
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

# 서버 실행
if __name__ == "__main__":
    uvicorn.run("recording:app", host="0.0.0.0", port=8000, reload=True)
