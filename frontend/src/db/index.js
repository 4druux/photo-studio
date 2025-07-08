import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

const url = new URL(process.env.DATABASE_URL);

const poolConnection = mysql.createPool({
  host: url.hostname,
  port: url.port,
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
  ssl: {
    rejectUnauthorized: true,
  },
  connectionLimit: 10,
});

export const db = drizzle(poolConnection, { schema, mode: "default" });
