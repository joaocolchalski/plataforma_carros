import { RegisterOptions, UseFormRegister } from "react-hook-form"

interface InputProps {
    name: string,
    type: string,
    placeholder: string,
    register: UseFormRegister<any>,
    error?: string,
    rules?: RegisterOptions
}

export default function Input({ name, type, placeholder }: InputProps) {
    return (
        <div>
            <input
                className="w-full border-1 rounded-md h-11 px-2 outline-none"
                name={name}
                type={type}
                placeholder={placeholder}
            />
        </div>
    )
}