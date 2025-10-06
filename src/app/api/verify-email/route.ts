import { getDbClient } from "@/lib/db/server";
import { type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const token = searchParams.get("token");

    if (!token) {
        return new Response(generateHTML(400, "Invalid or missing token"), {
            status: 400,
            headers: { "Content-Type": "text/html" },
        });
    }

    const client = getDbClient();

    const res = await client.query(
        "SELECT id, email_verification_token_expires_at, email_verified FROM users WHERE email_verification_token = $1",
        [token]
    );

    const user = res.rows[0];

    if (!user) {
        return new Response(generateHTML(400, "Invalid verification link"), {
            status: 400,
            headers: { "Content-Type": "text/html" },
        });
    }

    const { id, email_verified, email_verification_expires_at } = user;

    if (email_verified) {
        return new Response(generateHTML(200, "Email already verified"), {
            status: 200,
            headers: { "Content-Type": "text/html" },
        });
    }

    if (new Date() > new Date(email_verification_expires_at)) {
        return new Response(generateHTML(400, "Verification link expired"), {
            status: 400,
            headers: { "Content-Type": "text/html" },
        });
    }

    await client.query(
        "UPDATE users SET email_verified = true, email_verification_token = NULL, email_verification_token_expires_at = NULL WHERE id = $1",
        [id]
    );

    return new Response(
        generateHTML(200, "Your email has been successfully verified"),
        {
            status: 200,
            headers: { "Content-Type": "text/html" },
        }
    );
}

function generateHTML(status: number, message: string): string {
    return `
    <html>
      <head><title>${status == 200 ? "Email Verified" : "Failed"}</title></head>
      <body>
        <h1>${message}</h1>
        <p>${
            status == 200
                ? 'You can now <a href="/auth">log in</a>'
                : "Failed, resend verification email"
        }.</p>
      </body>
    </html>
    `;
}
