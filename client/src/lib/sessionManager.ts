/**
 * Session Manager: Handles user session tracking via cookies
 * Generates a unique session ID for each user and persists it in localStorage
 */

const SESSION_ID_KEY = "quiz_session_id";
const SESSION_EXPIRY_DAYS = 365;

export function getSessionId(): string {
  // Check if session ID exists in localStorage
  const existing = localStorage.getItem(SESSION_ID_KEY);
  if (existing) {
    return existing;
  }

  // Generate new session ID
  const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  localStorage.setItem(SESSION_ID_KEY, sessionId);

  return sessionId;
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_ID_KEY);
}

/**
 * Quiz data types
 */
export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizData {
  title: string;
  description?: string;
  questions: QuizQuestion[];
}

export interface QuizAttemptAnswer {
  questionIndex: number;
  selectedAnswer: string;
}

export interface QuizResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  attemptId: number;
}

export interface AttemptReview {
  questionIndex: number;
  selectedAnswer: string;
  isCorrect: boolean;
}

/**
 * Parse quiz data from text format
 * Expected format:
 * Title: Quiz Title
 * Description: Optional description
 * ---
 * Q1: Question text?
 * A) Option A
 * B) Option B
 * C) Option C
 * D) Option D
 * Correct: A
 * ---
 * Q2: Next question?
 * ...
 */
export function parseQuizFromText(content: string): QuizData | null {
  const lines = content.split("\n").map((line) => line.trim());

  let title = "";
  let description = "";
  const questions: QuizQuestion[] = [];
  let currentQuestion: Partial<QuizQuestion> | null = null;
  let currentOptions: string[] = [];

  for (const line of lines) {
    if (line.startsWith("Title:")) {
      title = line.replace("Title:", "").trim();
    } else if (line.startsWith("Description:")) {
      description = line.replace("Description:", "").trim();
    } else if (line === "---") {
      // Save previous question if exists
      if (currentQuestion && currentQuestion.question && currentQuestion.correctAnswer) {
        questions.push({
          question: currentQuestion.question,
          options: currentOptions,
          correctAnswer: currentQuestion.correctAnswer,
        });
      }
      currentQuestion = null;
      currentOptions = [];
    } else if (line.startsWith("Q") && line.includes(":")) {
      currentQuestion = {
        question: line.replace(/^Q\d+:\s*/, ""),
      };
      currentOptions = [];
    } else if (line.match(/^[A-Z]\)\s/)) {
      currentOptions.push(line.replace(/^[A-Z]\)\s*/, ""));
    } else if (line.startsWith("Correct:")) {
      if (currentQuestion) {
        const correctOption = line.replace("Correct:", "").trim();
        const correctIndex = correctOption.charCodeAt(0) - 65; // A=0, B=1, etc
        if (correctIndex >= 0 && correctIndex < currentOptions.length) {
          currentQuestion.correctAnswer = currentOptions[correctIndex];
        }
      }
    }
  }

  // Save last question
  if (currentQuestion && currentQuestion.question && currentQuestion.correctAnswer) {
    questions.push({
      question: currentQuestion.question,
      options: currentOptions,
      correctAnswer: currentQuestion.correctAnswer,
    });
  }

  if (!title || questions.length === 0) {
    return null;
  }

  return {
    title,
    description: description || undefined,
    questions,
  };
}

