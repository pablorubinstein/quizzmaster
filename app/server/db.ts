import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, quizzes, userSessions, quizAttempts, userAnswers, quizFeedback } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Quiz queries
 */
export async function getAllQuizzes() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(quizzes);
}

export async function getQuizById(quizId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(quizzes).where(eq(quizzes.id, quizId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createQuiz(title: string, description: string | null, content: string) {
  const db = await getDb();
  if (!db) return undefined;

  try {
    const result = await db.insert(quizzes).values({ title, description, content });
    return result;
  } catch (error) {
    console.error("[Database] Failed to create quiz:", error);
    return undefined;
  }
}

/**
 * User session queries
 */
export async function getOrCreateUserSession(sessionId: string) {
  const db = await getDb();
  if (!db) return undefined;

  try {
    const existing = await db.select().from(userSessions).where(eq(userSessions.sessionId, sessionId)).limit(1);
    if (existing.length > 0) return existing[0];

    const result = await db.insert(userSessions).values({ sessionId });
    return { sessionId };
  } catch (error) {
    console.error("[Database] Failed to get/create session:", error);
    return undefined;
  }
}

/**
 * Quiz attempt queries
 */
export async function createQuizAttempt(sessionId: string, quizId: number, score: number, totalQuestions: number, randomizationSeed: number) {
  const db = await getDb();
  if (!db) return undefined;

  try {
    const result = await db.insert(quizAttempts).values({ sessionId, quizId, score, totalQuestions, randomizationSeed });
    return result;
  } catch (error) {
    console.error("[Database] Failed to create quiz attempt:", error);
    return undefined;
  }
}

export async function getUserSessionAttempts(sessionId: string) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(quizAttempts).where(eq(quizAttempts.sessionId, sessionId));
  } catch (error) {
    console.error("[Database] Failed to get session attempts:", error);
    return [];
  }
}

export async function getUserSessionStats(sessionId: string) {
  const db = await getDb();
  if (!db) return { totalAttempts: 0, averageScore: 0, quizzes: [] };

  try {
    const attempts = await db.select().from(quizAttempts).where(eq(quizAttempts.sessionId, sessionId));
    const averageScore = attempts.length > 0
      ? Math.round((attempts.reduce((sum, a) => sum + (a.score / a.totalQuestions) * 100, 0) / attempts.length))
      : 0;

    return {
      totalAttempts: attempts.length,
      averageScore,
      quizzes: attempts,
    };
  } catch (error) {
    console.error("[Database] Failed to get session stats:", error);
    return { totalAttempts: 0, averageScore: 0, quizzes: [] };
  }
}

/**
 * User answers queries
 */
export async function createUserAnswer(attemptId: number, questionIndex: number, selectedAnswer: string, isCorrect: boolean) {
  const db = await getDb();
  if (!db) return undefined;

  try {
    const result = await db.insert(userAnswers).values({
      attemptId,
      questionIndex,
      selectedAnswer,
      isCorrect: isCorrect ? "true" : "false",
    });
    return result;
  } catch (error) {
    console.error("[Database] Failed to create user answer:", error);
    return undefined;
  }
}

export async function getAttemptAnswers(attemptId: number) {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(userAnswers).where(eq(userAnswers.attemptId, attemptId));
  } catch (error) {
    console.error("[Database] Failed to get attempt answers:", error);
    return [];
  }
}

/**
 * Quiz feedback queries
 */
export async function submitQuizFeedback(sessionId: string, type: "error" | "suggestion", quizId: number | null, questionIndex: number | null, message: string) {
  const db = await getDb();
  if (!db) return undefined;

  try {
    const result = await db.insert(quizFeedback).values({
      sessionId,
      type,
      quizId,
      questionIndex,
      message,
    });
    return result;
  } catch (error) {
    console.error("[Database] Failed to submit feedback:", error);
    return undefined;
  }
}

export async function getAllFeedback() {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(quizFeedback);
  } catch (error) {
    console.error("[Database] Failed to get feedback:", error);
    return [];
  }
}

