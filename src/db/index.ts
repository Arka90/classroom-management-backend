import { drizzle } from "drizzle-orm/node-postgres";
const databaseUrl = process.env.DATABASE_URL;
console.log(databaseUrl)
if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined in the environment variables");
}
export const db = drizzle(databaseUrl);