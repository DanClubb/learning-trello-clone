// lib/tokens.ts
import crypto from "crypto";

export function generateToken(size = 32): string {
    return crypto.randomBytes(size).toString("hex");
}
