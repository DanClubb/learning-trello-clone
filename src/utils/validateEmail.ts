type ValidateEmail = {
    valid: boolean;
    value: string;
};

export function validateEmail(email: string): ValidateEmail {
    const safeEmail = String(email ?? "").trim();

    // regex checks basic shape of email, e.g. "user@example.com"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    const valid =
        safeEmail.length >= 3 &&
        safeEmail.length <= 50 &&
        emailRegex.test(safeEmail);
    return { valid, value: safeEmail };
}
