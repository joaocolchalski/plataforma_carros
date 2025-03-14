import { RegisterOptions, UseFormRegister } from "react-hook-form"

interface InputProps {
    name: string,
    type: string,
    placeholder: string,
    register: UseFormRegister<any>,
    error?: string,
    rules?: RegisterOptions
}

export default function Input({ name, type, placeholder, register, error, rules }: InputProps) {
    return (
        <div>
            <input
                className="w-full border-1 rounded-md h-11 px-2 outline-none"
                type={type}
                placeholder={placeholder}
                {...register(name, rules)}
                id={name}
            />
            {error && <p className="my-1 text-red-500">{error}</p>}
        </div>
    )
}