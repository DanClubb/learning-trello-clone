"use client";

import { useRef, useState } from "react";

export default function Home() {
    const [responseMessage, setResponseMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

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
                <br />
                <label className="text-black" htmlFor="password">
                    Password
                </label>
                <input
                    className="bg-white p-2 rounded-lg text-black"
                    type="password"
                    id="password"
                    name="password"
                    ref={passwordRef}
                    required
                />
                <br />
                <button className="p-2 bg-black rounded-lg" type="submit">
                    {isLoading ? "Loading..." : "Submit"}
                </button>
            </form>
            <div>{responseMessage}</div>
        </main>
    );
}
