import { neon } from "@neondatabase/serverless";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function run() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) throw new Error("DATABASE_URL not found");
  
  const sql = neon(dbUrl);
  
  const schemaPath = path.join(process.cwd(), "scripts", "003_neon_users_profiles.sql");
  const schema = fs.readFileSync(schemaPath, "utf-8");
  
  console.log("Running migration...");
  
  // Split statements and execute individually
  const statements = schema.split(';').filter(s => s.trim().length > 0);
  for (const statement of statements) {
    await sql.query(statement);
  }
  
  console.log("Migration complete! Tables created successfully.");
}

run().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
