import { Link, useNavigate } from 'react-router'
import logoImg from '../../assets/logo.svg'
import ContainerAuth from '../../components/ContainerAuth'
import Input from '../../components/Input'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createUserWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth'
import { auth } from '../../services/firebaseConnection'
import { useContext, useEffect } from 'react'
import { AuthContext } from '../../contexts/auth'
import SpinnerLoading from '../../components/SpinnerLoading'
import toast from 'react-hot-toast'

const schema = z.object({
    name: z.string().trim().nonempty('O campo nome é obrigatório! (Espaços em branco não são considerados)'),
    email: z.string().trim().email('Insira um e-mail válido! (Espaços em branco não são considerados)').nonempty('O campo email é obrigatório!'),
    password: z.string().trim().min(6, 'A senha deve ter pelo menos 6 caracteres! (Espaços em branco não são considerados)').nonempty('O campo senha é obrigatório!'),
})

type FormData = z.infer<typeof schema>

export default function Register() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: 'onChange'
    })

    const navigate = useNavigate()

    const { loadingAuth, handleInfoUser } = useContext(AuthContext)

    useEffect(() => {
        async function handleSignOut() {
            await signOut(auth)
        }

        handleSignOut()
    }, [])

    async function onSubmit(data: FormData) {
        await createUserWithEmailAndPassword(auth, data.email, data.password)
            .then(async (user) => {
                await updateProfile(user.user, {
                    displayName: data.name
                })

                handleInfoUser({
                    name: data.name,
                    email: data.email,
                    uid: user.user.uid
                })
                toast.success('Bem vindo a plataforma!')
                navigate('/dashboard', { replace: true })
            })
            .catch((err) => {
                if (err.code === 'auth/email-already-in-use') {
                    toast.error('Email já em uso por outro usuário!')
                } else {
                    console.log(err.code)
                }
            })
    }

    if (loadingAuth) {
        return (
            <div className="w-full min-h-screen flex justify-center items-center">
                <SpinnerLoading />
            </div>
        )
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
                className="bg-white max-w-xl w-full rounded-lg px-4 py-7"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="mb-4">
                    <Input
                        name='name'
                        type='text'
                        placeholder='Digite seu nome completo...'
                        error={errors.name?.message}
                        register={register}
                    />
                </div>

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
                    className="w-full text-white font-medium text-lg h-11 bg-zinc-900 rounded-md"
                    type="submit"
                >
                    {isSubmitting ? (
                        <div className="w-full h-full flex justify-center items-center">
                            <SpinnerLoading />
                        </div>
                    ) : (
                        'Cadastrar'
                    )}
                </button>
            </form>

            <Link
                className="text-zinc-700"
                to='/login'
            >
                Já possui uma conta? Faça login
            </Link>
        </ContainerAuth>
    )
}