import { Link, useNavigate } from 'react-router'
import logoImg from '../../assets/logo.svg'
import ContainerAuth from '../../components/ContainerAuth'
import Input from '../../components/Input'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth } from '../../services/firebaseConnection'
import { useEffect } from 'react'

const schema = z.object({
    email: z.string().email('Insira um email válido!').nonempty('O campo email é obrigatório!'),
    password: z.string().nonempty('O campo senha é obrigatório!'),
})

type FormData = z.infer<typeof schema>

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: 'onChange'
    })

    const navigate = useNavigate()

    useEffect(() => {
        async function handleSignOut() {
            await signOut(auth)
        }

        handleSignOut()
    }, [])

    async function onSubmit(data: FormData) {
        await signInWithEmailAndPassword(auth, data.email, data.password)
            .then(() => {
                alert('Seja bem vindo de volta!')
                navigate('/dashboard')
            })
            .catch((err) => {
                if (err.code === 'auth/invalid-credential') {
                    alert('Email incorreto ou senha incorreta!')
                } else {
                    console.log(err.code)
                }
            })
    }

    return (
        <ContainerAuth>
            <Link to='/' className='mb-6 max-w-sm w-full'>
                <img
                    src={logoImg}
                    alt='Logo da Empresa'
                    className='w-full'
                />
            </Link>

            <form
                className="bg-white max-w-xl w-full rounded-lg p-4"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="mb-4">
                    <Input
                        name='email'
                        type='email'
                        placeholder='Digite seu email...'
                        error={errors.email?.message}
                        register={register}
                    />
                </div>

                <div className="mb-4">
                    <Input
                        name='password'
                        type='password'
                        placeholder='Digite sua senha...'
                        error={errors.password?.message}
                        register={register}
                    />
                </div>

                <button
                    className="w-full text-white font-medium text-lg h-11 bg-zinc-900 rounded-md cursor-pointer"
                    type="submit"
                >
                    Acessar
                </button>
            </form>

            <Link
                className="text-zinc-700"
                to='/register'
            >
                Ainda não possui uma conta? Cadastre-se
            </Link>
        </ContainerAuth>
    )
}