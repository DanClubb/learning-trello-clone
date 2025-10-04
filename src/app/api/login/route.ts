import bcrypt from "bcrypt";
import { getDbClient } from "@/lib/db/server";

const DUMMY_HASH = bcrypt.hashSync("dummy_password_123!@#", 10);

// TODOS:
// - track login attempts and add a timed locked after num of failed attempts
// - check password against already compromised passwords
// - create and send JWT token

export async function POST(req: Request) {
    try {
        let { email, password } = await req.json();

        const safeEmail = String(email ?? "").trim();
        const safePassword = String(password ?? "").trim();

        // input validations

        // basic pattern check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        const passwordRegex = /^[\x20-\x7E]{8,100}$/;

        if (!emailRegex.test(safeEmail) || !passwordRegex.test(safePassword)) {
            return new Response("Invalid email or password", {
                status: 400,
            });
        }

        const client = getDbClient();

        const user = await client.query<{ password_hash: string }>(
            "SELECT password_hash FROM users WHERE email = $1",
            [safeEmail]
        );

        const hashToCompare: string =
            user?.rows[0]?.password_hash || DUMMY_HASH;

        const passwordMatch = await bcrypt.compare(safePassword, hashToCompare);

        if (passwordMatch && (user.rowCount ?? 0) > 0) {
            return new Response(`Successfully logged in`, {
                status: 200,
            });
        } else {
            return new Response(`Email or password is incorrect`, {
                status: 401,
            });
        }
    } catch (err) {
        console.error(err);
        return new Response("Error authenticating user", { status: 500 });
    }
}
