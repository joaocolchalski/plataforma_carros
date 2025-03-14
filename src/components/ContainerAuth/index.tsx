import { ReactNode } from "react";

export default function ContainerAuth({ children }: { children: ReactNode }) {
    return (
        <div className="w-full max-w-7xl mx-auto min-h-screen flex justify-center items-center flex-col gap-4">
            {children}
        </div>
    )
}