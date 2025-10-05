import SignupLoginForm from "./_components/SignupLoginForm";

export default function Home() {
    return (
        <main className="h-full grid place-items-center">
            <h1>
                Please{" "}
                <a href="/auth" className="text-blue-400 underline">
                    Login or sign up
                </a>
            </h1>
        </main>
    );
}
