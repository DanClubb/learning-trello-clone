import bcrypt from "bcrypt";
import { getDbClient } from "@/lib/db/server";
import { validateEmail } from "@/utils/validateEmail";
import { validatePassword } from "@/utils/validatePassword";

// TODOS:
// - sign up with google
// - send email for user to verify sign up email
// - create and send JWT token

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        // input validations
        const { valid: emailValid, value: safeEmail } = validateEmail(email);
        const { valid: passwordValid, value: safePassword } =
            validatePassword(password);

        console.log("email => ", safeEmail);

        if (!emailValid || !passwordValid)
            return new Response("Invalid email or password", { status: 400 });

        const client = getDbClient();

        const emailExists = await client.query(
            "SELECT 1 FROM users WHERE email = $1",
            [safeEmail]
        );

        if (emailExists?.rows?.length > 0) {
            return new Response(
                `We couldn’t complete your sign-up. 
                The email may already be in use, invalid, or there may be a temporary issue. Please check your email and try again.`,
                { status: 202 }
            );
        }

        const password_hash = await bcrypt.hash(safePassword, 10);

        const addUser =
            "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *";
        const values = [safeEmail, password_hash];

        const res = await client.query(addUser, values);
        console.log("res => ", res);

        return new Response(`Created successfully: ${safeEmail}`, {
            status: 201,
        });
    } catch (err) {
        console.error(err);
        return new Response("Error inserting user", { status: 500 });
    }
}
