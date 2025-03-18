import { Link } from "react-router";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConnection";

export default function DashboardHeader() {
    async function handleLogout() {
        await signOut(auth)
    }

    return (
        <div className="w-full flex items-center bg-red-500 rounded-lg h-11 px-5 gap-4 mb-4 text-white font-bold">
            <Link className="hover:border-b-2 transition-all duration-50" to='/dashboard'>
                Dashboard
            </Link>

            <Link className="hover:border-b-2 transition-all duration-50" to='/dashboard/new'>
                Novo Carro
            </Link>

            <button className="ml-auto hover:border-b-2 transition-all duration-50" onClick={handleLogout}>
                Sair da conta
            </button>
        </div>
    )
}