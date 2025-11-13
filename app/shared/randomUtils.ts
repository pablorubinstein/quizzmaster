/**
 * Seeded Random Number Generator
 * 
 * Provides reproducible randomization using a seeded PRNG (Pseudo-Random Number Generator).
 * This ensures that the same seed always produces the same random sequence,
 * allowing quiz questions and options to be randomized consistently for review purposes.
 * 
 * Algorithm: Mulberry32 - a simple but effective 32-bit PRNG
 */

/**
 * Seeded Random Number Generator class
 * Uses Mulberry32 algorithm for fast, reproducible randomization
 */
export class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed >>> 0; // Convert to unsigned 32-bit integer
  }

  /**
   * Generate next random number between 0 (inclusive) and 1 (exclusive)
   */
  next(): number {
    this.seed |= 0; // Convert to signed 32-bit integer
    this.seed = (this.seed + 0x6d2b79f5) | 0;

    let t = Math.imul(this.seed ^ (this.seed >>> 15), 1 | this.seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Generate random integer between min (inclusive) and max (exclusive)
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min)) + min;
  }

  /**
   * Shuffle an array using Fisher-Yates algorithm with seeded randomization
   * Returns a new shuffled array without modifying the original
   */
  shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}

/**
 * Generate a seed from quiz ID and attempt ID
 * This ensures reproducible randomization for the same quiz attempt
 * 
 * @param quizId - The quiz ID
 * @param attemptId - The attempt ID
 * @returns A numeric seed
 */
export function generateSeed(quizId: number, attemptId: number): number {
  // Combine quiz ID and attempt ID to create a unique seed
  // Use bitwise operations to ensure we get a 32-bit integer
  return ((quizId * 73856093) ^ (attemptId * 19349663)) >>> 0;
}

/**
 * Generate a seed from a timestamp (for new attempts)
 * This creates a unique seed for each new attempt
 * 
 * @returns A numeric seed based on current timestamp
 */
export function generateRandomSeed(): number {
  return Math.floor(Math.random() * 0xffffffff) >>> 0;
}

/**
 * Randomize quiz questions while preserving question indices
 * Returns questions in randomized order along with their original indices
 * 
 * @param questions - Array of questions
 * @param seed - Seed for reproducible randomization
 * @returns Array of objects with randomized questions and their original indices
 */
export interface RandomizedQuestion<T> {
  question: T;
  originalIndex: number;
}

export function randomizeQuestions<T>(
  questions: T[],
  seed: number
): RandomizedQuestion<T>[] {
  const rng = new SeededRandom(seed);
  
  // Create array of questions with their original indices
  const indexed = questions.map((question, index) => ({
    question,
    originalIndex: index,
  }));

  // Shuffle using seeded random
  return rng.shuffle(indexed);
}

/**
 * Randomize options within a question
 * Returns options in randomized order along with their original indices
 * 
 * @param options - Array of options
 * @param seed - Seed for reproducible randomization
 * @returns Array of objects with randomized options and their original indices
 */
export interface RandomizedOption<T> {
  option: T;
  originalIndex: number;
}

export function randomizeOptions<T>(
  options: T[],
  seed: number
): RandomizedOption<T>[] {
  const rng = new SeededRandom(seed);
  
  // Create array of options with their original indices
  const indexed = options.map((option, index) => ({
    option,
    originalIndex: index,
  }));

  // Shuffle using seeded random
  return rng.shuffle(indexed);
}

/**
 * Create a mapping from randomized option index to original option index
 * Useful for converting user selections back to original option indices
 * 
 * @param randomizedOptions - Array of randomized options with original indices
 * @returns Map from randomized index to original index
 */
export function createOptionIndexMap(
  randomizedOptions: RandomizedOption<any>[]
): Map<number, number> {
  const map = new Map<number, number>();
  randomizedOptions.forEach((item, randomizedIndex) => {
    map.set(randomizedIndex, item.originalIndex);
  });
  return map;
}

/**
 * Example usage:
 * 
 * // Generate seed for reproducible randomization
 * const seed = generateSeed(quizId, attemptId);
 * 
 * // Randomize questions
 * const randomizedQuestions = randomizeQuestions(questions, seed);
 * 
 * // For each question, randomize its options
 * const randomizedQuestionsWithOptions = randomizedQuestions.map((item, index) => {
 *   const questionSeed = seed + index; // Different seed for each question
 *   const randomizedOptions = randomizeOptions(item.question.options, questionSeed);
 *   
 *   return {
 *     ...item,
 *     question: {
 *       ...item.question,
 *       options: randomizedOptions.map(opt => opt.option),
 *       optionIndexMap: createOptionIndexMap(randomizedOptions),
 *     },
 *   };
 * });
 */
