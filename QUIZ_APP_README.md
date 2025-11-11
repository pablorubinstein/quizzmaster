# Quiz Application - Complete Documentation

## Overview

This is a full-stack web application for creating, taking, and reviewing multiple-choice quizzes. The application is built with React (frontend), Express/tRPC (backend), and MySQL (database).

**Key Features:**
- Create and manage quizzes from text files
- Take quizzes with an intuitive interface
- Automatic score calculation and tracking
- Session-based user tracking (no authentication required)
- Review missed questions after completing a quiz
- Report quiz errors and suggest new quizzes
- View quiz history and statistics

---

## Technology Stack

| Component | Technology |
|-----------|-----------|
| Frontend | React 19 + TypeScript + Tailwind CSS |
| Backend | Express 4 + tRPC 11 |
| Database | MySQL/TiDB |
| State Management | tRPC + React Query |
| UI Components | shadcn/ui |

---

## Project Structure

```
quiz_app/
├── client/                      # Frontend application
│   ├── src/
│   │   ├── pages/              # Page components
│   │   │   ├── Home.tsx        # Quiz list and statistics
│   │   │   ├── Quiz.tsx        # Quiz taking interface
│   │   │   ├── Review.tsx      # Answer review page
│   │   │   ├── Feedback.tsx    # Feedback submission
│   │   │   └── History.tsx     # Attempt history
│   │   ├── lib/
│   │   │   ├── trpc.ts         # tRPC client setup
│   │   │   └── sessionManager.ts # Session and quiz utilities
│   │   ├── App.tsx             # Route configuration
│   │   └── main.tsx            # Entry point
│   └── index.html
│
├── server/                      # Backend application
│   ├── routers/
│   │   └── quiz.ts             # Quiz tRPC procedures
│   ├── db.ts                   # Database query helpers
│   ├── routers.ts              # Main router setup
│   └── _core/                  # Framework core files
│
├── drizzle/                     # Database schema
│   ├── schema.ts               # Table definitions
│   └── migrations/             # Database migrations
│
├── sample_quizzes.txt          # Sample quiz data
└── QUIZ_APP_README.md          # This file
```

---

## Database Schema

### Users Table
Stores user information (for potential future authentication).

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  openId VARCHAR(64) UNIQUE NOT NULL,
  name TEXT,
  email VARCHAR(320),
  role ENUM('user', 'admin') DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Quizzes Table
Stores quiz metadata and content.

```sql
CREATE TABLE quizzes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  content TEXT NOT NULL,  -- JSON stringified quiz data
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### User Sessions Table
Tracks user sessions via session ID (no authentication).

```sql
CREATE TABLE userSessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sessionId VARCHAR(64) UNIQUE NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Quiz Attempts Table
Records each quiz attempt with score.

```sql
CREATE TABLE quizAttempts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sessionId VARCHAR(64) NOT NULL,
  quizId INT NOT NULL,
  score INT NOT NULL,
  totalQuestions INT NOT NULL,
  completedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### User Answers Table
Stores individual question responses for review.

```sql
CREATE TABLE userAnswers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  attemptId INT NOT NULL,
  questionIndex INT NOT NULL,
  selectedAnswer VARCHAR(255) NOT NULL,
  isCorrect ENUM('true', 'false') NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Quiz Feedback Table
Stores error reports and quiz suggestions.

```sql
CREATE TABLE quizFeedback (
  id INT PRIMARY KEY AUTO_INCREMENT,
  sessionId VARCHAR(64) NOT NULL,
  type ENUM('error', 'suggestion') NOT NULL,
  quizId INT,
  questionIndex INT,
  message TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Quiz Data Format

Quizzes are stored as JSON in the database but can be created from text files using the following format:

```
Title: Quiz Title
Description: Optional description of the quiz
---
Q1: What is the first question?
A) Option A
B) Option B
C) Option C
D) Option D
Correct: A
---
Q2: What is the second question?
A) Option A
B) Option B
C) Option C
D) Option D
Correct: B
---
```

**Format Rules:**
- Start with `Title:` followed by the quiz title
- Optionally add `Description:` for quiz description
- Separate questions with `---`
- Each question starts with `Q#:` (e.g., `Q1:`, `Q2:`)
- Options are labeled A), B), C), D)
- Specify the correct answer with `Correct:` followed by the letter (A, B, C, or D)

### Example Quiz

See `sample_quizzes.txt` for complete examples including:
- General Knowledge Quiz
- Science Quiz
- History Quiz

---

## API Endpoints (tRPC Procedures)

All endpoints are accessed via `/api/trpc` and use tRPC's type-safe client.

### Quiz Procedures

#### `quiz.listQuizzes`
Get all available quizzes.

**Request:** None
**Response:**
```typescript
Array<{
  id: number;
  title: string;
  description: string | null;
  createdAt: Date;
}>
```

#### `quiz.getQuiz`
Get a specific quiz with all questions.

**Request:**
```typescript
{ quizId: number }
```

**Response:**
```typescript
{
  id: number;
  title: string;
  description: string | null;
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
  }>;
  createdAt: Date;
}
```

#### `quiz.submitQuizAttempt`
Submit a quiz attempt and record answers.

**Request:**
```typescript
{
  sessionId: string;
  quizId: number;
  answers: Array<{
    questionIndex: number;
    selectedAnswer: string;
  }>;
}
```

**Response:**
```typescript
{
  score: number;
  totalQuestions: number;
  percentage: number;
  attemptId: number;
}
```

#### `quiz.getSessionStats`
Get user's session statistics.

**Request:**
```typescript
{ sessionId: string }
```

**Response:**
```typescript
{
  totalAttempts: number;
  averageScore: number;
  quizzes: Array<QuizAttempt>;
}
```

#### `quiz.getSessionAttempts`
Get all attempts for a session.

**Request:**
```typescript
{ sessionId: string }
```

**Response:**
```typescript
Array<{
  id: number;
  quizId: number;
  score: number;
  totalQuestions: number;
  percentage: number;
  completedAt: Date;
}>
```

#### `quiz.getAttemptDetails`
Get details of a specific attempt (for review).

**Request:**
```typescript
{ attemptId: number }
```

**Response:**
```typescript
Array<{
  questionIndex: number;
  selectedAnswer: string;
  isCorrect: boolean;
}>
```

#### `quiz.submitFeedback`
Submit feedback about a quiz (error report or suggestion).

**Request:**
```typescript
{
  sessionId: string;
  type: "error" | "suggestion";
  quizId?: number;
  questionIndex?: number;
  message: string;  // 1-1000 characters
}
```

**Response:**
```typescript
{ success: boolean }
```

---

## Frontend Pages

### Home Page (`/`)
- Displays list of available quizzes
- Shows user statistics (total attempts, average score)
- Navigation buttons to upload quizzes, send feedback, and view history

### Quiz Page (`/quiz/:quizId`)
- Interactive quiz interface
- Question progress indicator
- Multiple choice options
- Previous/Next navigation
- Submit button on last question
- Real-time answer tracking

### Review Page (`/review/:attemptId`)
- Shows all questions and user's answers
- Highlights correct vs. incorrect answers
- Displays correct answers for missed questions
- Option to retake quiz

### Feedback Page (`/feedback`)
- Form to report quiz errors
- Form to suggest new quizzes
- Character counter for feedback message
- Confirmation message after submission

### History Page (`/history`)
- Lists all quiz attempts
- Shows score and percentage for each attempt
- Sorted by most recent first
- Links to review each attempt

---

## Session Management

The application uses **localStorage-based session tracking** instead of authentication:

1. **Session ID Generation**: A unique session ID is generated on first visit
2. **Storage**: Session ID is stored in browser's localStorage
3. **Persistence**: Session persists across browser sessions (until localStorage is cleared)
4. **Database Tracking**: All quiz attempts are linked to the session ID

**Session Manager Functions** (`client/src/lib/sessionManager.ts`):
- `getSessionId()`: Get or create session ID
- `clearSession()`: Clear session from localStorage
- `parseQuizFromText()`: Parse quiz data from text format

---

## Running the Application

### Development

```bash
# Install dependencies
pnpm install

# Push database schema
pnpm db:push

# Start development server
pnpm dev
```

The application will be available at `http://localhost:3000`

### Production Build

```bash
# Build frontend and backend
pnpm build

# Start production server
pnpm start
```

---

## Adding Quizzes

### Option 1: Direct Database Insert

Use the database admin panel to insert quiz data:

```sql
INSERT INTO quizzes (title, description, content) VALUES (
  'Quiz Title',
  'Quiz Description',
  '{"title":"Quiz Title","description":"Quiz Description","questions":[{"question":"Q1?","options":["A","B","C","D"],"correctAnswer":"A"}]}'
);
```

### Option 2: Via API (Future Enhancement)

Create an admin endpoint to upload quizzes from text files.

### Option 3: Sample Data

The `sample_quizzes.txt` file contains three complete quizzes that can be manually parsed and inserted.

---

## User Tracking Without Authentication

The application uses **session-based tracking** for the following reasons:

1. **No Login Required**: Users can immediately start taking quizzes
2. **Persistent Sessions**: Session ID stored in localStorage persists across visits
3. **Privacy**: No personal information is collected
4. **Simple Implementation**: Lightweight alternative to full authentication

**Limitations:**
- Different browsers/devices = different sessions
- Clearing localStorage = lost session history
- No password reset or account recovery

---

## Feedback System

Users can submit two types of feedback:

### Error Reports
- Report incorrect answers in quizzes
- Specify which question has the error
- Include detailed description

### Suggestions
- Suggest new quiz topics
- Request specific subjects
- Provide quiz ideas

All feedback is stored in the `quizFeedback` table and can be reviewed by administrators.

---

## Customization

### Styling
- Global styles: `client/src/index.css`
- Component styles: Tailwind CSS classes
- Theme colors: CSS variables in `index.css`

### Quiz Format
To modify the quiz data format, edit:
- `client/src/lib/sessionManager.ts` - `parseQuizFromText()` function
- `server/routers/quiz.ts` - Quiz data structure

### Database
To add new fields or tables:
1. Edit `drizzle/schema.ts`
2. Run `pnpm db:push`
3. Update database query helpers in `server/db.ts`
4. Update tRPC procedures in `server/routers/quiz.ts`

---

## Troubleshooting

### Quiz not loading
- Check if quiz ID is correct
- Verify quiz data in database is valid JSON
- Check browser console for errors

### Session not persisting
- Verify localStorage is enabled in browser
- Check if session ID is being stored correctly
- Clear browser cache and try again

### Feedback not submitting
- Ensure message is between 1-1000 characters
- Check network tab for API errors
- Verify database connection

---

## Future Enhancements

- [ ] Quiz upload interface for users
- [ ] Quiz categories and filtering
- [ ] Timed quizzes with countdown
- [ ] Leaderboard/rankings
- [ ] Quiz sharing via links
- [ ] Admin dashboard for feedback review
- [ ] Email notifications for feedback
- [ ] Quiz difficulty levels
- [ ] Progress tracking and analytics
- [ ] Mobile app version

---

## License

This project is provided as-is for educational and personal use.

---

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the database schema and API documentation
3. Check browser console and server logs for errors
4. Verify all environment variables are set correctly

