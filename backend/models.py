# models.py
from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

# --- Gemini Quiz Models ---
class Question(BaseModel):
    id: int
    question: str
    options: List[str]
    correct_answer: str
    explanation: str

class QuizRequest(BaseModel):
    domain: str
    difficulty: str
    count: int

class QuizResponse(BaseModel):
    quiz: List[Question]


# --- User & Auth Models ---
class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=70)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# --- Quiz History Models ---
class QuestionAnswerDetail(BaseModel):
    question_text: str
    options: List[str]
    correct_answer: str
    user_answer: str
    explanation: str
    is_correct: bool

class QuizSubmission(BaseModel):
    domain: str
    difficulty: str
    total_questions: int
    score: int
    time_taken_seconds: int
    answers: List[QuestionAnswerDetail]