import { Pool } from "pg";

console.log(
    "Supabase connection string:",
    process.env.SUPABASE_CONNECTION_STRING
);

const pool = new Pool({
    connectionString: process.env.SUPABASE_CONNECTION_STRING!,
    ssl:
        process.env.NODE_ENV === "production"
            ? { rejectUnauthorized: true }
            : { rejectUnauthorized: false },
});

export function getDbClient() {
    return pool;
}
