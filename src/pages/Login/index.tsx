import { Link } from 'react-router'
import logoImg from '../../assets/logo.svg'
import ContainerAuth from '../../components/ContainerAuth'
import Input from '../../components/Input'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

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

    function onSubmit(data: FormData) {
        console.log(data)
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
                className="bg-red-600 max-w-xl w-full rounded-lg"
                onSubmit={handleSubmit(onSubmit)}
            >
                <Input
                    name='email'
                    type='email'
                    placeholder='Digite seu email...'
                    error={errors.email?.message}
                    register={register}
                />

                <Input
                    name='password'
                    type='password'
                    placeholder='Digite sua senha...'
                    error={errors.password?.message}
                    register={register}
                />

                <button
                    className="w-full text-white font-bold text-lg h-11 bg-zinc-900 rounded-md"
                    type="submit"
                >
                    Acessar
                </button>
            </form>
        </ContainerAuth>
    )
}