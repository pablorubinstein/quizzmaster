import { drizzle } from "drizzle-orm/mysql2";
import { quizzes } from "./drizzle/schema.ts";
import 'dotenv/config'; // Loads .env file at the start


const db = drizzle(process.env.DATABASE_URL);

const sampleQuizzes = [
  {
    title: "General Knowledge Quiz",
    description: "Test your knowledge on various topics",
    content: JSON.stringify({
      title: "General Knowledge Quiz",
      description: "Test your knowledge on various topics",
      questions: [
        {
          question: "What is the capital of France?",
          options: ["London", "Paris", "Berlin", "Madrid"],
          correctAnswer: "Paris",
        },
        {
          question: "Which planet is known as the Red Planet?",
          options: ["Venus", "Mars", "Jupiter", "Saturn"],
          correctAnswer: "Mars",
        },
        {
          question: "What is the largest ocean on Earth?",
          options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
          correctAnswer: "Pacific Ocean",
        },
        {
          question: "Who wrote 'Romeo and Juliet'?",
          options: ["Jane Austen", "William Shakespeare", "Charles Dickens", "Mark Twain"],
          correctAnswer: "William Shakespeare",
        },
        {
          question: "What is the chemical symbol for Gold?",
          options: ["Go", "Gd", "Au", "Ag"],
          correctAnswer: "Au",
        },
      ],
    }),
  },
  {
    title: "Science Quiz",
    description: "Questions about biology, chemistry, and physics",
    content: JSON.stringify({
      title: "Science Quiz",
      description: "Questions about biology, chemistry, and physics",
      questions: [
        {
          question: "What is the powerhouse of the cell?",
          options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus"],
          correctAnswer: "Mitochondria",
        },
        {
          question: "What is the pH of pure water at 25°C?",
          options: ["5", "6", "7", "8"],
          correctAnswer: "7",
        },
        {
          question: "What is the SI unit of force?",
          options: ["Joule", "Watt", "Newton", "Pascal"],
          correctAnswer: "Newton",
        },
        {
          question: "How many bones are in the adult human body?",
          options: ["186", "206", "226", "246"],
          correctAnswer: "206",
        },
        {
          question: "What is the most abundant element in the universe?",
          options: ["Oxygen", "Carbon", "Hydrogen", "Nitrogen"],
          correctAnswer: "Hydrogen",
        },
      ],
    }),
  },
  {
    title: "History Quiz",
    description: "Questions about world history and events",
    content: JSON.stringify({
      title: "History Quiz",
      description: "Questions about world history and events",
      questions: [
        {
          question: "In what year did World War II end?",
          options: ["1943", "1944", "1945", "1946"],
          correctAnswer: "1945",
        },
        {
          question: "Who was the first President of the United States?",
          options: ["Thomas Jefferson", "George Washington", "John Adams", "James Madison"],
          correctAnswer: "George Washington",
        },
        {
          question: "In which year did the Titanic sink?",
          options: ["1910", "1911", "1912", "1913"],
          correctAnswer: "1912",
        },
        {
          question: "Which empire built the Great Wall of China?",
          options: ["Han Dynasty", "Ming Dynasty", "Qin Dynasty", "Tang Dynasty"],
          correctAnswer: "Ming Dynasty",
        },
        {
          question: "In what year did the Berlin Wall fall?",
          options: ["1987", "1988", "1989", "1990"],
          correctAnswer: "1989",
        },
      ],
    }),
  },
];

async function seed() {
  try {
    console.log("Seeding database with sample quizzes...");
    
    for (const quiz of sampleQuizzes) {
      await db.insert(quizzes).values(quiz);
      console.log(`✓ Added quiz: ${quiz.title}`);
    }
    
    console.log("\n✓ Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();