import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function run() {
  const sql = neon(process.env.DATABASE_URL!);
  
  // Hash password
  const passwordHash = await bcrypt.hash("LumenHackathon2026", 12);
  
  try {
    const users = await sql`
      INSERT INTO users (email, password_hash) 
      VALUES ('admin@lumennex.com', ${passwordHash}) 
      RETURNING id
    `;
    const userId = users[0].id;
    
    await sql`
      INSERT INTO profiles (user_id, display_name) 
      VALUES (${userId}, 'Lumen Admin')
    `;
    
    console.log("Account created successfully!");
    console.log("Email: admin@lumennex.com");
    console.log("Password: LumenHackathon2026");
  } catch (err: any) {
    if (err.message.includes('unique constraint')) {
      console.log("Account already exists! You can log in with: admin@lumennex.com / LumenHackathon2026");
    } else {
      console.error("Error creating account:", err);
    }
  }
}

run().catch(console.error);
