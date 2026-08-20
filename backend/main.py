# main.py
# use this model-gemini-3.5-flash
import os
from datetime import datetime
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from google.genai import types
from bson import ObjectId

from database import users_collection, quizzes_collection
from models import QuizRequest, QuizResponse, UserRegister, UserLogin, Token, QuizSubmission

from auth import (
    hash_password, verify_password, create_access_token, get_current_user
)

load_dotenv()

app = FastAPI(title="AI Quiz Generator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# --- 1. Auth Endpoints ---

@app.post("/api/auth/register", status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister):
    existing_user = await users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    new_user = {
        "username": user_data.username,
        "email": user_data.email,
        "password": hash_password(user_data.password)
    }
    result = await users_collection.insert_one(new_user)
    access_token = create_access_token(data={"sub": str(result.inserted_id)})
    return {"access_token": access_token, "token_type": "bearer"}


@app.post("/api/auth/login", response_model=Token)
async def login(credentials: UserLogin):
    user = await users_collection.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(data={"sub": str(user["_id"])})
    return {"access_token": access_token, "token_type": "bearer"}


# --- 2. Quiz Generator Endpoint ---

@app.post("/api/generate-quiz")
async def generate_quiz_endpoint(request: QuizRequest):
    try:
        prompt = f"""
        Generate a quiz with exactly {request.count} multiple-choice questions.
        Domain/Topic: {request.domain}
        Difficulty level: {request.difficulty}
        
        Requirements:
        - Each question must have exactly 4 options.
        - Exactly one option must be the correct answer.
        - Provide a concise 1-line explanation for the correct answer.
        """

        response = client.models.generate_content(
            model="gemini-3.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=QuizResponse,
                temperature=0.7,
            ),
        )
        return {"status": "success", "data": response.text}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# --- 3. Save Quiz Results Endpoint ---

@app.post("/api/quizzes/submit", status_code=status.HTTP_201_CREATED)
async def submit_quiz(submission: QuizSubmission, current_user: dict = Depends(get_current_user)):
    quiz_record = {
        "user_id": current_user["id"],
        "domain": submission.domain,
        "difficulty": submission.difficulty,
        "total_questions": submission.total_questions,
        "score": submission.score,
        "time_taken_seconds": submission.time_taken_seconds,
        "answers": [answer.model_dump() for answer in submission.answers],
        "created_at": datetime.utcnow()
    }
    result = await quizzes_collection.insert_one(quiz_record)
    return {"message": "Quiz saved successfully", "quiz_id": str(result.inserted_id)}


# --- 4. Dashboard Overview History Endpoint ---

@app.get("/api/quizzes/dashboard")
async def get_dashboard_history(current_user: dict = Depends(get_current_user)):
    cursor = quizzes_collection.find({"user_id": current_user["id"]}).sort("created_at", -1)
    history = []
    async for quiz in cursor:
        history.append({
            "id": str(quiz["_id"]),
            "domain": quiz["domain"],
            "difficulty": quiz["difficulty"],
            "total_questions": quiz["total_questions"],
            "score": quiz["score"],
            "time_taken_seconds": quiz["time_taken_seconds"],
            "created_at": quiz["created_at"].isoformat()
        })
    return history


# --- 5. Detailed Quiz Review Endpoint ---

@app.get("/api/quizzes/history/{quiz_id}")
async def get_quiz_detail(quiz_id: str, current_user: dict = Depends(get_current_user)):
    quiz = await quizzes_collection.find_one({"_id": ObjectId(quiz_id), "user_id": current_user["id"]})
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz history record not found")
    
    quiz["id"] = str(quiz["_id"])
    del quiz["_id"]
    return quiz