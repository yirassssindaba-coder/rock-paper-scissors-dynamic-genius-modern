import "dotenv/config";

import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

const url = process.env.DATABASE_URL?.trim();

if (!url) {
  throw new Error(
    "DATABASE_URL must be set. Create a .env file in the project root with DATABASE_URL=postgresql://... ",
  );
}

export const pool = new Pool({ connectionString: url });
export const db = drizzle(pool, { schema });