"use client";

import { use, useRef, useState } from "react";
import Eye from "./_icons/Eye";
import SlashedEye from "./_icons/SlashedEye";
import { useRouter } from "next/navigation";

export default function Home() {
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
        <main className="h-full grid place-items-center">
            <form
                action=""
                onSubmit={handleSubmit}
                className="flex flex-col gap-2 bg-slate-300 p-4 rounded-lg w-96"
            >
                <label className="text-black" htmlFor="username">
                    Username
                </label>
                <input
                    className="bg-white p-2 rounded-lg text-black"
                    type="text"
                    id="username"
                    name="username"
                    ref={usernameRef}
                    required
                />
                <label className="text-black " htmlFor="password">
                    Password
                </label>
                <div className="relative">
                    <input
                        className="w-full bg-white p-2 rounded-lg text-black"
                        type={viewPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        ref={passwordRef}
                        required
                    />
                    <button
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-black cursor-pointer"
                        onClick={() => setViewPassword(!viewPassword)}
                    >
                        {viewPassword ? <SlashedEye /> : <Eye />}
                    </button>
                </div>

                <button className="p-2 bg-black rounded-lg" type="submit">
                    {isLoading ? "Loading..." : "Submit"}
                </button>
            </form>
            <div>{responseMessage}</div>
        </main>
    );
}
