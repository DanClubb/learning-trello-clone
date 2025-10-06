type LabelProps = {
    label: "email" | "password";
};

export default function AuthFormLabel({ label }: LabelProps) {
    return (
        <label className="pt-4 pb-1 text-black capitalize" htmlFor={label}>
            {label}
        </label>
    );
}
