"use client";

import { useRef, useState } from "react";
import Eye from "../../_icons/Eye";
import SlashedEye from "../../_icons/SlashedEye";
import { useRouter } from "next/navigation";
import Lock from "../../_icons/Lock";
import Envelope from "../../_icons/Envelope";
import Exlamation from "../../_icons/Exlamation";
import Tick from "../../_icons/Tick";
import AuthFormLabel from "./AuthFormLabel";
import AuthFormInput from "./AuthFormInput";

type FormStatus =
    | { state: "idle" }
    | { state: "loading" }
    | { state: "success"; message: string }
    | { state: "error"; message: string };

export default function SignupLoginForm() {
    const router = useRouter();

    const [isSignup, setIsSignup] = useState(true);
    const [formStatus, setFormStatus] = useState<FormStatus>({ state: "idle" });
    const [showPassword, setShowPassword] = useState(false);
    const emailRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const hasMessage =
        formStatus.state === "success" || formStatus.state === "error";

    async function submitAuthForm(
        email: string,
        password: string,
        isSignup: boolean
    ): Promise<{ status: number; message: string }> {
        const res = await fetch(`/api/${isSignup ? "sign-up" : "login"}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        return { status: res.status, message: await res.text() };
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setFormStatus({ state: "loading" });

        const email = (emailRef.current as HTMLInputElement).value;
        const password = (passwordRef.current as HTMLInputElement).value;

        const { status, message } = await submitAuthForm(
            email,
            password,
            isSignup
        );

        if (!isSignup && status === 200) {
            router.push("/dashboard");
            return;
        }

        if (status === 201) setFormStatus({ state: "success", message });
        else setFormStatus({ state: "error", message });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col bg-slate-200 p-4 rounded-lg w-96"
        >
            <div className="flex bg-slate-400 rounded-lg overflow-hidden text-black">
                <button
                    onClick={() => {
                        setIsSignup(true);
                        setFormStatus({ state: "idle" });
                    }}
                    className={`basis-1/2 py-4 cursor-pointer ${
                        isSignup
                            ? "bg-slate-950 text-white"
                            : "hover:bg-slate-500"
                    }`}
                    type="button"
                >
                    Sign up
                </button>
                <button
                    onClick={() => {
                        setIsSignup(false);
                        setFormStatus({ state: "idle" });
                    }}
                    className={`basis-1/2 py-4 cursor-pointer ${
                        !isSignup
                            ? "bg-slate-950 text-white"
                            : "hover:bg-slate-500"
                    }`}
                    type="button"
                >
                    Login
                </button>
            </div>

            <AuthFormLabel label="email" />
            <div className="flex justify-between items-center gap-2 px-3 bg-white text-black rounded-lg">
                <Envelope />
                <AuthFormInput name="email" ref={emailRef} />
            </div>

            <AuthFormLabel label="password" />
            <div className="flex justify-between items-center gap-3 px-2 bg-white text-black rounded-lg">
                <Lock />
                <AuthFormInput
                    name="password"
                    ref={passwordRef}
                    showPassword={showPassword}
                />
                <button
                    type="button"
                    className="cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? <SlashedEye /> : <Eye />}
                </button>
            </div>

            <button
                className="mt-8 p-2 bg-black rounded-lg cursor-pointer"
                type="submit"
                disabled={formStatus.state == "loading"}
            >
                {formStatus.state == "loading"
                    ? "Loading..."
                    : isSignup
                    ? "Sign up"
                    : "Login"}
            </button>

            {hasMessage && (
                <div
                    className={`flex gap-2 items-start mt-2 p-2 rounded-lg ${
                        formStatus.state == "success"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                    }`}
                >
                    {formStatus.state == "success" ? (
                        <Tick classes="shrink-0" />
                    ) : (
                        <Exlamation classes="shrink-0" />
                    )}
                    <p>{formStatus.message}</p>
                </div>
            )}
        </form>
    );
}
