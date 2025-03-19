import { Link } from "react-router";

export default function Error() {
    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center">
            <p className="font-bold text-4xl">Erro 404</p>
            <p className="font-bold text-4xl mb-2">Página não encontrada!</p>
            <Link
                to='/'
                className="bg-red-500 font-bold text-white text-lg rounded-md py-1 px-2"
            >
                Voltar para a Home
            </Link>
        </div>
    )
}