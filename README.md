# ⚡ AI Quiz Generator

A full-stack web application that dynamically generates custom quizzes based on user topics using **Google Gemini AI**, tracks timer-based gameplay, and provides detailed performance analytics and history.

---

## ✨ Features
- 🔐 **User Authentication**: JWT-based user registration and login.
- 🤖 **AI-Powered Quiz Generation**: Dynamic question generation across any topic/domain using Gemini API.
- ⏱️ **Interactive Timer**: Adaptive countdown timers based on difficulty settings (Easy, Medium, Hard).
- 📊 **Dashboard Analytics**: Overall performance summary, average scores, and completed topics.
- 📜 **Detailed Review History**: Question-by-question post-quiz breakdown with correct answers and explanations.

---

## 🛠️ Tech Stack

**Frontend:**
- React.js
- React Router v6
- Axios

**Backend:**
- FastAPI (Python)
- Google Gemini AI API (`google-generativeai`)
- SQLAlchemy / SQLite
- Passlib (Bcrypt password hashing) & PyJWT

---

## 🚀 Getting Started

### 1. Prerequisites
- Python 3.9+
- Node.js 18+
- Google Gemini API Key

### 2. Backend Setup
bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables in .env file
# GEMINI_API_KEY=your_gemini_api_key
# SECRET_KEY=your_jwt_secret_key
# MONGO_URI=your_mongo_uri

# Start FastAPI server
uvicorn app.main:app --reload --port 8000

### 3. Frontend Setup
bash
# Navigate to frontend directory
cd quiz-frontend

# Install dependencies
npm install

# Start React development server
npm run dev

---

## 🌐 API Routes
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/generate-quiz` - Generate AI quiz
- `POST /api/quizzes/submit` - Save completed quiz
- `GET /api/quizzes` - Get user quiz history
- `GET /api/quizzes/history/:id` - Fetch single quiz review
