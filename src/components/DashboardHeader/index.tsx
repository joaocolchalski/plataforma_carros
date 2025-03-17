import { Link } from "react-router";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConnection";

export default function DashboardHeader() {
    async function handleLogout() {
        await signOut(auth)
    }

    return (
        <div className="w-full flex items-center bg-red-500 rounded-lg py-2.5 px-5 gap-4 mb-4 text-white font-bold">
            <Link to='/dashboard'>
                Dashboard
            </Link>

            <Link to='/dashboard/new'>
                Novo Carro
            </Link>

            <button className="ml-auto" onClick={handleLogout}>
                Sair da conta
            </button>
        </div>
    )
}