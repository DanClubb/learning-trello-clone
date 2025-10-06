import bcrypt from "bcrypt";
import { getDbClient } from "@/lib/db/server";
import { validateEmail } from "@/utils/validateEmail";
import { validatePassword } from "@/utils/validatePassword";
import { sendEmail } from "@/lib/email/sendEmail";
import { generateToken } from "@/utils/generateToken";

// TODOS:
// - sign up with google
// - create and send JWT token
const EMAIL_TOKEN_EXPIRY_HOURS = 24;

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        // input validations
        const { valid: emailValid, value: safeEmail } = validateEmail(email);
        const { valid: passwordValid, value: safePassword } =
            validatePassword(password);

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
        const emailVerificationTokenExpiresAt = new Date(
            Date.now() + EMAIL_TOKEN_EXPIRY_HOURS * 60 * 60 * 1000
        );
        let emailVerificationToken: string;

        while (true) {
            emailVerificationToken = generateToken();

            const existingToken = await client.query(
                "SELECT 1 FROM users WHERE email_verification_token = $1",
                [emailVerificationToken]
            );

            if (existingToken.rowCount === 0) break;
        }

        const addUser =
            "INSERT INTO users (email, password_hash, email_verification_token, email_verification_token_expires_at) VALUES ($1, $2, $3, $4) RETURNING *";
        const values = [
            safeEmail,
            password_hash,
            emailVerificationToken,
            emailVerificationTokenExpiresAt,
        ];

        const res = await client.query(addUser, values);
        console.log("res => ", res);

        const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify-email?token=${emailVerificationToken}`;

        await sendEmail(
            safeEmail,
            "test",
            `
            <h1>Please verify your email</h1>
            <p>Click the button below to verify your email address:</p>
            <a href="${verificationLink}" style="padding: 10px 20px; background: #4CAF50; color: white; text-decoration: none;">Verify Email</a>
            `
        );

        return new Response(
            `Thank you for signing up! Please check your email (${safeEmail}) for a verification link to complete your registration.`,
            {
                status: 201,
            }
        );
    } catch (err) {
        console.error(err);
        return new Response("Error inserting user", { status: 500 });
    }
}
