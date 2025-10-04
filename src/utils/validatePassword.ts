type ValidatePassword = {
    valid: boolean;
    value: string;
};

export function validatePassword(password: string): ValidatePassword {
    const safePassword = String(password ?? "").trim();

    // regex checks no non ascii or control chars
    const passwordRegex = /^[\x20-\x7E]+$/;

    const valid =
        safePassword.length >= 8 &&
        safePassword.length <= 100 &&
        passwordRegex.test(safePassword);

    return { valid, value: safePassword };
}
