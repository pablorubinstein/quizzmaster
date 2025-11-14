import { drizzle } from "drizzle-orm/mysql2";
import { eq } from 'drizzle-orm';
import { quizzes } from "./drizzle/schema.ts";
import 'dotenv/config'; // Loads .env file at the start
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const db = drizzle(process.env.DATABASE_URL);
let sampleQuizzes = [];
const chunkSize = 10;

/* 
 * Insert jsons into db. Splits into 10-question quizzes.
 */
async function seed() {
  try {
    const directoryPath = './quizzes';
    const filenames = await readdir(directoryPath);

    // process json files
    for (const filename of filenames) {
      if (!filename.endsWith('.json'))
        continue;
      const filePath = path.join(directoryPath, filename);
      const fileContent = await readFile(filePath, { encoding: 'utf8' });
      const j = JSON.parse(fileContent);
      const title = j.title;
      const description = j.description;
      
      // split into chunks
      for (let i = 0; i < j.questions.length; i += chunkSize) {
        const chunk = j.questions.slice(i, i + chunkSize);
        const title_new = `${title} ${i/chunkSize+1}`;

        const j2 = JSON.parse(`{"title": "${title_new}", "description": "${description}", "questions": []}`);
        j2.questions = chunk; // overwrite questions with chunk
        sampleQuizzes.push({
          title: title_new,
          description: description,
          content: JSON.stringify(j2)
        });
      }
    }

    console.log("Seeding database with sample quizzes...");
    
    for (const quiz of sampleQuizzes) {
      const result = await db.select({title: quizzes.title}).from(quizzes).where(eq(quizzes.title, quiz.title));
      if (result.length === 0) {
        await db.insert(quizzes).values(quiz);
        console.log(`✓ Added quiz: ${quiz.title}`);
      } else {
        console.log(`Skipped quiz: ${quiz.title}`);
      }
    }
    
    console.log("\n✓ Database seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();