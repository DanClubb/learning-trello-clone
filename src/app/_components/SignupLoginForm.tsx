"use client";

import { useRef, useState } from "react";
import Eye from "../_icons/Eye";
import SlashedEye from "../_icons/SlashedEye";
import { useRouter } from "next/navigation";
import Lock from "../_icons/Lock";
import Envelope from "../_icons/Envelope";
import Exlamation from "../_icons/Exlamation";

export default function SignupLoginForm() {
    const router = useRouter();

    const [isSignup, setIsSignup] = useState(true);
    const [responseMessage, setResponseMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const emailRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);

        const email = (emailRef.current as HTMLInputElement).value;
        const password = (passwordRef.current as HTMLInputElement).value;

        const res = await fetch(`/api/${isSignup ? "sign-up" : "login"}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        setIsLoading(false);

        if (res.status == 201 || res.status == 200) {
            router.push("/dashboard");
        } else {
            setResponseMessage(await res.text());
        }
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
                        setResponseMessage(null);
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
                        setResponseMessage(null);
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

            <Label label="email" />
            <div className="flex justify-between items-center gap-2 px-3 bg-white text-black rounded-lg">
                <Envelope />
                <Input name="email" ref={emailRef} />
            </div>

            <Label label="password" />
            <div className="flex justify-between items-center gap-3 px-2 bg-white text-black rounded-lg">
                <Lock />
                <Input
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
                disabled={isLoading}
            >
                {isLoading ? "Loading..." : isSignup ? "Sign up" : "Login"}
            </button>

            {responseMessage && (
                <div className="flex gap-2 items-center mt-2 p-2 rounded-lg bg-red-200 text-red-700">
                    <Exlamation classes="shrink-0" />
                    <p>{responseMessage}</p>
                </div>
            )}
        </form>
    );
}

type LabelProps = {
    label: "email" | "password";
};

const Label = ({ label }: LabelProps) => {
    return (
        <label className="pt-4 pb-1 text-black capitalize" htmlFor={label}>
            {label}
        </label>
    );
};

type InputProps = {
    name: "email" | "password";
    ref: React.RefObject<HTMLInputElement | null>;
    showPassword?: boolean;
};

const Input = ({ name, ref, showPassword }: InputProps) => {
    const hidePassword = name == "password" && !showPassword;

    return (
        <input
            className="px-0 w-full bg-white p-2 text-black"
            type={
                name == "password"
                    ? hidePassword
                        ? "password"
                        : "text"
                    : "email"
            }
            id={name}
            name={name}
            ref={ref}
            placeholder={`Enter your ${name}`}
            min={name == "email" ? 3 : 8}
            max={name == "email" ? 50 : 100}
            required
        />
    );
};
