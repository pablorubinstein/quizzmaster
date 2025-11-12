import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import {
  getAllQuizzes,
  getQuizById,
  createQuiz,
  createQuizAttempt,
  getAttemptAnswers,
  createUserAnswer,
  getUserSessionAttempts,
  getUserSessionStats,
  submitQuizFeedback,
  getOrCreateUserSession,
} from "../db";


function createSeededPRNG(seed: number) {
  let state = seed;
  const a = 1103515245;
  const c = 12345;
  const m = 2**31; // Modulus

  return function() {
    state = (a * state + c) % m;
    return state / m; // Return a value between 0 (inclusive) and 1 (exclusive)
  };
}

// Deterministic Fisher-Yates shuffle
function deterministicShuffle(qd: QuizData, seed: number) {
  const prng = createSeededPRNG(seed);
  let array = qd.questions;
  const shuffledArray = [...array]; // Create a shallow copy to avoid modifying the original

  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1)); // Use the seeded PRNG
    [shuffledArray[i].options, shuffledArray[j].options] = [shuffledArray[j].options, shuffledArray[i].options];
  }

  qd.questions = shuffledArray;
  return qd;
}

// function shuffle(quizdata: QuizData) {
  
//   let some_array = quizdata.questions;
//   let currentIndex = some_array.length;

//   // While there remain elements to shuffle...
//   while (currentIndex != 0) {

//     // Pick a remaining element...
//     let randomIndex = Math.floor(Math.random() * currentIndex);
//     currentIndex--;

//     // And swap it with the current element.
//     [some_array[currentIndex], some_array[randomIndex]] = [
//       some_array[randomIndex], some_array[currentIndex]];
//   }
// }

/**
 * Quiz data structure stored in the database
 */
interface QuizData {
  title: string;
  description?: string;
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
  }>;
}

export const quizRouter = router({
  /**
   * Get all available quizzes
   */
  listQuizzes: publicProcedure.query(async () => {
    const quizzes = await getAllQuizzes();
    return quizzes.map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      createdAt: quiz.createdAt,
    }));
  }),

  /**
   * Get a specific quiz with all questions
   */
  getQuiz: publicProcedure
    .input(z.object({ quizId: z.number() }))
    .query(async ({ input }) => {
      const quiz = await getQuizById(input.quizId);
      if (!quiz) {
        throw new Error("Quiz not found");
      }

      let quizData: QuizData;
      try {
        quizData = JSON.parse(quiz.content);
        // quizData = deterministicShuffle(quizData, quiz.id);
      } catch (error) {
        throw new Error("Invalid quiz data format");
      }

      let qd = {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        questions: quizData.questions,
        createdAt: quiz.createdAt,
      };
      return qd;
    }),

  /**
   * Submit a quiz attempt and record answers
   */
  submitQuizAttempt: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        quizId: z.number(),
        answers: z.array(
          z.object({
            questionIndex: z.number(),
            selectedAnswer: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      // Ensure session exists
      await getOrCreateUserSession(input.sessionId);

      // Get the quiz to validate answers
      const quiz = await getQuizById(input.quizId);
      if (!quiz) {
        throw new Error("Quiz not found");
      }

      let quizData: QuizData;
      try {
        quizData = JSON.parse(quiz.content);
        // quizData = deterministicShuffle(quizData, quiz.id);
      } catch (error) {
        throw new Error("Invalid quiz data format");
      }

      // Calculate score
      let score = 0;
      const answerDetails: Array<{ questionIndex: number; isCorrect: boolean }> = [];

      for (const answer of input.answers) {
        const question = quizData.questions[answer.questionIndex];
        if (!question) continue;

        const isCorrect = answer.selectedAnswer === question.correctAnswer;
        if (isCorrect) score++;
        answerDetails.push({ questionIndex: answer.questionIndex, isCorrect });
      }

      // Create attempt record
      const attemptResult = await createQuizAttempt(
        input.sessionId,
        input.quizId,
        score,
        quizData.questions.length
      );

      if (!attemptResult) {
        throw new Error("Failed to create quiz attempt");
      }

      // Get the attempt ID from the result
      const attemptId = (attemptResult as any)[0].insertId ; // PABLO || (attemptResult as any)[0];

      // Record individual answers
      for (const answer of input.answers) {
        const detail = answerDetails.find((d) => d.questionIndex === answer.questionIndex);
        if (detail) {
          await createUserAnswer(
            attemptId,
            answer.questionIndex,
            answer.selectedAnswer,
            detail.isCorrect
          );
        }
      }

      return {
        score,
        totalQuestions: quizData.questions.length,
        percentage: Math.round((score / quizData.questions.length) * 100),
        attemptId,
      };
    }),

  /**
   * Get user's session statistics
   */
  getSessionStats: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      const stats = await getUserSessionStats(input.sessionId);
      return stats;
    }),

  /**
   * Get all attempts for a session
   */
  getSessionAttempts: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      const attempts = await getUserSessionAttempts(input.sessionId);
      return attempts.map((attempt) => ({
        id: attempt.id,
        quizId: attempt.quizId,
        score: attempt.score,
        totalQuestions: attempt.totalQuestions,
        percentage: Math.round((attempt.score / attempt.totalQuestions) * 100),
        completedAt: attempt.completedAt,
      }));
    }),

  /**
   * Get details of a specific attempt (for review) with full question information
   */
  getAttemptDetails: publicProcedure
    .input(z.object({ attemptId: z.number(), quizId: z.number() }))
    .query(async ({ input }) => {
      const answers = await getAttemptAnswers(input.attemptId);
      const quiz = await getQuizById(input.quizId);

      if (!quiz) {
        throw new Error("Quiz not found");
      }

      let quizData: QuizData;
      try {
        quizData = JSON.parse(quiz.content);
      } catch (error) {
        throw new Error("Invalid quiz data format");
      }

      return answers.map((answer) => {
        const question = quizData.questions[answer.questionIndex];
        return {
          questionIndex: answer.questionIndex,
          question: question?.question || "Question not found",
          options: question?.options || [],
          correctAnswer: question?.correctAnswer || "",
          selectedAnswer: answer.selectedAnswer,
          isCorrect: answer.isCorrect === "true",
        };
      });
    }),

  /**
   * Upload a new quiz
   */
  uploadQuiz: publicProcedure
    .input(
      z.object({
        title: z.string().min(1).max(255),
        description: z.string().max(1000).nullable(),
        content: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // Validate that content is valid JSON
      let quizData: QuizData;
      try {
        quizData = JSON.parse(input.content);
      } catch (error) {
        throw new Error("Invalid quiz data format");
      }

      // Validate quiz structure
      if (!quizData.questions || quizData.questions.length === 0) {
        throw new Error("Quiz must have at least one question");
      }

      for (const question of quizData.questions) {
        if (!question.question || !question.options || !question.correctAnswer) {
          throw new Error("Each question must have text, options, and a correct answer");
        }
        if (question.options.length < 2) {
          throw new Error("Each question must have at least 2 options");
        }
        if (!question.options.includes(question.correctAnswer)) {
          throw new Error("Correct answer must be one of the options");
        }
      }

      // Create the quiz in the database
      const result = await createQuiz(input.title, input.description, input.content);
      if (!result) {
        throw new Error("Failed to create quiz");
      }

      return {
        success: true,
        message: `Quiz "${input.title}" has been uploaded successfully`,
      };
    }),

  /**
   * Submit feedback about a quiz (error report or suggestion)
   */
  submitFeedback: publicProcedure
    .input(
      z.object({
        sessionId: z.string(),
        type: z.enum(["error", "suggestion"]),
        quizId: z.number().optional(),
        questionIndex: z.number().optional(),
        message: z.string().min(1).max(1000),
      })
    )
    .mutation(async ({ input }) => {
      await submitQuizFeedback(
        input.sessionId,
        input.type,
        input.quizId || null,
        input.questionIndex || null,
        input.message
      );

      return { success: true };
    }),
});
