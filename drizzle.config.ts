import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const url = process.env.DATABASE_URL?.trim();

if (!url) {
  throw new Error(
    "DATABASE_URL is missing. Create a .env file in the project root and set DATABASE_URL=postgresql://... "
  );
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url,
  },
});