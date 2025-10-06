type InputProps = {
    name: "email" | "password";
    ref: React.RefObject<HTMLInputElement | null>;
    showPassword?: boolean;
};

export default function AuthFormInput({ name, ref, showPassword }: InputProps) {
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
}
