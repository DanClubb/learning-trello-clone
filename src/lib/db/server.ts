import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.NEXT_PUBLIC_SUPABASE_CONNECTION_STRING!,
    ssl: {
        rejectUnauthorized: false,
    },
});

export function getDbClient() {
    return pool;
}
