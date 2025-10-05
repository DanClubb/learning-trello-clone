import tls from "tls";

export function sendEmail(recipient: string, subject: string, html: string) {
    const client = tls.connect(
        {
            host: process.env.SMTP_HOST as string,
            port: 465,
            rejectUnauthorized: true,
        },
        () => {
            console.log("Connected securely!");
        }
    );

    let stage = 0; // tracks where we are in the SMTP sequence

    client.on("data", (data) => {
        const response = data.toString();
        console.log("Server:", response);

        switch (stage) {
            case 0:
                // Server says hello: 220 ready
                if (response.startsWith("220")) {
                    client.write(`EHLO ${process.env.SMTP_EHLO_DOMAIN}\r\n`);
                    stage = 1;
                }
                break;

            case 1:
                // EHLO response: 250
                if (response.startsWith("250")) {
                    client.write("AUTH LOGIN\r\n");
                    stage = 2;
                }
                break;

            case 2:
                // Server asks for username: 334
                if (response.startsWith("334")) {
                    client.write(
                        Buffer.from(process.env.SMTP_USER as string).toString(
                            "base64"
                        ) + "\r\n"
                    );
                    stage = 3;
                }
                break;

            case 3:
                // Server asks for password: 334 again
                if (response.startsWith("334")) {
                    client.write(
                        Buffer.from(process.env.SMTP_PASS as string).toString(
                            "base64"
                        ) + "\r\n"
                    );
                    stage = 4;
                }
                break;

            case 4:
                // Auth successful: 235
                if (response.startsWith("235")) {
                    client.write(`MAIL FROM:<${process.env.SMTP_USER}>\r\n`);
                    stage = 5;
                }
                break;

            case 5:
                // MAIL FROM accepted: 250
                if (response.startsWith("250")) {
                    client.write(`RCPT TO:<${recipient}>\r\n`);
                    stage = 6;
                }
                break;

            case 6:
                // RCPT TO accepted: 250
                if (response.startsWith("250")) {
                    client.write("DATA\r\n");
                    stage = 7;
                }
                break;

            case 7:
                // DATA ready: 354
                if (response.startsWith("354")) {
                    const message = [
                        `Subject: ${subject}`,
                        `From: ${process.env.SMTP_USER}`,
                        `To: ${recipient}`,
                        "Content-Type: text/html; charset=utf-8",
                        "",
                        html,
                        ".",
                    ].join("\r\n");
                    client.write(message + "\r\n");
                    stage = 8;
                }
                break;

            case 8:
                // Message accepted: 250
                if (response.startsWith("250")) {
                    client.write("QUIT\r\n");
                    stage = 9;
                }
                break;

            case 9:
                // QUIT acknowledged: 221
                if (response.startsWith("221")) {
                    console.log("Email sent and connection closed.");
                    client.end();
                }
                break;
        }
    });

    client.on("error", (err) => {
        console.error("SMTP error:", err);
        client.end();
    });
}
