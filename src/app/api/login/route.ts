import bcrypt from "bcrypt";
import { getDbClient } from "@/lib/db/server";
import { validateEmail } from "@/utils/validateEmail";
import { validatePassword } from "@/utils/validatePassword";

const DUMMY_HASH = bcrypt.hashSync("dummy_password_123!@#", 10);

// TODOS:
// - track login attempts and add a timed locked after num of failed attempts
// - check password against already compromised passwords
// - create and send JWT token
// - forgot/reset password flow
// - make email not verified a generic response message

export async function POST(req: Request) {
    try {
        let { email, password } = await req.json();

        // input validations
        const { valid: emailValid, value: safeEmail } = validateEmail(email);
        const { valid: passwordValid, value: safePassword } =
            validatePassword(password);

        if (!emailValid || !passwordValid)
            return new Response("Invalid email or password", { status: 400 });

        const client = getDbClient();

        const user = await client.query<{
            password_hash: string;
            email_verified: boolean;
        }>("SELECT password_hash, email_verified FROM users WHERE email = $1", [
            safeEmail,
        ]);

        console.log("user => ", user);

        if (!user?.rows[0]?.email_verified) {
            return new Response(`Email not verified`, {
                status: 401,
            });
        }

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
