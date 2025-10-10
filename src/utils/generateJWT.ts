import { base64urlEncode } from "./base64UrlEncode";
import crypto from "crypto";

type JwtPayload = {
    sub: string;
    name: string;
    admin: boolean;
};

export function generateJWT(payload: JwtPayload, expiresInSec = 900) {
    const header = { alg: "HS256", typ: "JWT" };
    const now = Math.floor(Date.now() / 1000);
    const fullPayload = { ...payload, iat: now, exp: now + expiresInSec };

    const encodedHeader = base64urlEncode(header);
    const encodedPayload = base64urlEncode(fullPayload);

    // prettier-ignore
    const signature = crypto
        .createHmac("sha256", process.env.JWT_SECRET!)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest("base64")
        .split("=").join("")
        .split("+").join("-")
        .split("/").join("_");

    return `${encodedHeader}.${encodedPayload}.${signature}`;
}
