import bcrypt from "bcrypt";
import { getDbClient } from "@/lib/db/server";

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();
        // input validations
        if (!username || !password) {
            return new Response("invalid username or password", {
                status: 400,
            });
        }

        const client = getDbClient();

        const usernameExists = await client.query(
            "SELECT 1 FROM users WHERE username = $1",
            [username]
        );

        if (usernameExists?.rows?.length > 0) {
            return new Response("Username already exists", { status: 409 });
        }

        const password_hash = await bcrypt.hash(password, 10);

        const query =
            "INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *";
        const values = [username, password_hash];

        const res = await client.query(query, values);

        return new Response(`Created successfully: ${username}`, {
            status: 201,
        });
    } catch (err) {
        console.error(err);
        return new Response("Error inserting user", { status: 500 });
    }
}
