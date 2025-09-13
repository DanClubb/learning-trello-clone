"use client";

import { use, useRef, useState } from "react";
import Eye from "../_icons/Eye";
import SlashedEye from "../_icons/SlashedEye";
import { useRouter } from "next/navigation";

export default function SignupLoginForm() {
    const router = useRouter();

    const [responseMessage, setResponseMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [viewPassword, setViewPassword] = useState(false);

    const usernameRef = useRef<HTMLInputElement | null>(null);
    const passwordRef = useRef<HTMLInputElement | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setIsLoading(true);

        const username = (usernameRef.current as HTMLInputElement).value;
        const password = (passwordRef.current as HTMLInputElement).value;
        console.log("Username:", username);
        console.log("Password:", password);

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/sign-up`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            }
        );

        setResponseMessage(await res.text());
        setIsLoading(false);

        if (res.ok) {
            router.push("/dashboard");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col bg-slate-300 p-4 rounded-lg w-96"
        >
            <Label label="username" />
            <Input name="username" ref={usernameRef} />
            <Label label="password" />
            <div className="relative">
                <Input name="password" ref={passwordRef} />
                <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-black cursor-pointer"
                    onClick={() => setViewPassword(!viewPassword)}
                >
                    {viewPassword ? <SlashedEye /> : <Eye />}
                </button>
            </div>

            <button className="mt-8 p-2 bg-black rounded-lg" type="submit">
                {isLoading ? "Loading..." : "Submit"}
            </button>

            <div>{responseMessage}</div>
        </form>
    );
}

type LabelProps = {
    label: "username" | "password";
};

const Label = ({ label }: LabelProps) => {
    return (
        <label className="pt-4 pb-1 text-black capitalize" htmlFor={label}>
            {label}
        </label>
    );
};

type InputProps = {
    name: "username" | "password";
    ref: React.RefObject<HTMLInputElement | null>;
    viewPassword?: boolean;
};

const Input = ({ name, ref, viewPassword }: InputProps) => {
    return (
        <input
            className="w-full bg-white p-2 rounded-lg text-black"
            type={
                name === "password"
                    ? viewPassword
                        ? "text"
                        : "password"
                    : "text"
            }
            id={name}
            name={name}
            ref={ref}
            required
        />
    );
};
