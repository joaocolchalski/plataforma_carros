import { onAuthStateChanged } from "firebase/auth";
import { createContext, ReactNode, useEffect, useState } from "react";
import { auth } from "../services/firebaseConnection";

interface AuthProviderProps {
    children: ReactNode
}

type AuthContextData = {
    signed: boolean,
    loadingAuth: boolean,
    handleInfoUser: ({ name, email, uid }: UserProps) => void,
    user: UserProps | null
}

interface UserProps {
    uid: string,
    name: string | null,
    email: string | null,
}

export const AuthContext = createContext({} as AuthContextData)

export default function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<UserProps | null>(null)
    const [loadingAuth, setLoadingAuth] = useState(true)

    useEffect(() => {
        function checkLogin() {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    const userData = {
                        uid: user.uid,
                        name: user?.displayName,
                        email: user?.email
                    }

                    setUser(userData)
                    setLoadingAuth(false)
                } else {
                    setUser(null)
                    setLoadingAuth(false)
                }
            })
        }

        checkLogin()

        return () => {
            checkLogin()
        }
    }, [])

    function handleInfoUser({ name, email, uid }: UserProps) {
        setUser({
            name,
            email,
            uid
        })
    }

    return (
        <AuthContext
            value={{
                signed: !!user,
                loadingAuth,
                handleInfoUser,
                user
            }}
        >
            {children}
        </AuthContext>
    )
}