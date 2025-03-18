import { ReactNode, useContext } from "react";
import { AuthContext } from "../contexts/auth";
import { Navigate } from "react-router";
import SpinnerLoading from "../components/SpinnerLoading";

interface PrivateProps {
    children: ReactNode
}

export default function PrivateApp({ children }: PrivateProps): any {
    const { signed, loadingAuth } = useContext(AuthContext)

    if (loadingAuth) {
        return (
            <div className="w-full min-h-screen flex justify-center items-center">
                <SpinnerLoading />
            </div>
        )
    }

    if (!signed) {
        return <Navigate to={'/login'} />
    }

    return children
}