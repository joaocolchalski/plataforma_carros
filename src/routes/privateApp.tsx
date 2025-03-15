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
            <SpinnerLoading />
        )
    }

    if (!signed) {
        return <Navigate to={'/login'} />
    }

    console.log(signed)
    return children
}