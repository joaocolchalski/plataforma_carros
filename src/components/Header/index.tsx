import { Link } from 'react-router';
import logoImg from '../../assets/logo.svg'
import { FiUser, FiLogIn } from 'react-icons/fi';
import { useContext } from 'react';
import { AuthContext } from '../../contexts/auth';

export default function Header() {
    const { signed, loadingAuth } = useContext(AuthContext);

    if (loadingAuth) {
        return
    }

    return (
        <div className="w-full flex items-center justify-center h-16 bg-white drop-shadow mb-4">
            <header className='flex w-full max-w-7xl row items-center justify-between px-4 mx-auto'>
                <Link to='/'>
                    <img src={logoImg} alt="Logo da Empresa" />
                </Link>

                {signed && (
                    <Link to='/dashboard'>
                        <div className="border-2 border-black rounded-full p-1">
                            <FiUser size={24} color='#000' />
                        </div>
                    </Link>
                )}

                {!signed && (
                    <Link to='/login'>
                        <div className="border-2 border-black rounded-full p-1">
                            <FiLogIn size={24} color='#000' />
                        </div>
                    </Link>
                )}
            </header>
        </div>
    )
}