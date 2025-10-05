import { type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const token = searchParams.get("token");

    return new Response(
        `
    <html>
      <head><title>Email Verified</title></head>
      <body>
        <h1>Your email has been successfully verified</h1>
        <p>You can now <a href="/auth">log in</a>.</p>
        <p>${token}</p>
      </body>
    </html>
  `,
        {
            status: 200,
            headers: { "Content-Type": "text/html" },
        }
    );
}
