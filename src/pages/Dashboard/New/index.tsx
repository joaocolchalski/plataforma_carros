import { ChangeEvent, useContext, useState } from "react";
import Container from "../../../components/Container";
import DashboardHeader from "../../../components/DashboardHeader";
import Input from "../../../components/Input";

import { FiTrash, FiUpload } from "react-icons/fi";
import { useForm } from 'react-hook-form'
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import SpinnerLoading from "../../../components/SpinnerLoading";
import { AuthContext } from "../../../contexts/auth";
import { v4 as uuidV4 } from 'uuid'
import { storage } from "../../../services/firebaseConnection";
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from 'firebase/storage'

const schema = z.object({
    name: z.string().trim().nonempty('O nome do carro é obrigatório!'),
    model: z.string().trim().nonempty('O modelo do carro é obrigatório!'),
    year: z.string().trim().nonempty('O ano do carro é obrigatório!'),
    km: z.string().trim().nonempty('Os Km do carro é obrigatório!'),
    price: z.string().trim().nonempty('O preço do carro é obrigatório!'),
    city: z.string().trim().nonempty('A cidade do carro é obrigatória!'),
    whatsapp: z.string().nonempty('O telefone é obrigatório!').refine((value) => /^\d{2,3} ?\d{9}$/.test(value), {
        message: 'Digite um telefone válido no formato DD + 9 números!'
    }),
    description: z.string().nonempty('A descrição é obrigatória!')
})

type FormData = z.infer<typeof schema>

interface ImageItensProps {
    uid: string,
    name: string,
    previewUrl: string,
    url: string
}

export default function New() {
    const { user } = useContext(AuthContext)
    const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: 'onChange'
    })

    const [carImages, setCarImages] = useState<ImageItensProps[]>([])

    async function onSubmit(data: FormData) {
        console.log(data)
    }

    async function handleFile(event: ChangeEvent<HTMLInputElement>) {
        if (event.target.files && event.target.files[0]) {
            const image = event.target.files[0]

            if (image.type === 'image/jpeg' || image.type === 'image/png') {
                await handleUpload(image)
            } else {
                alert('A imagem precisa ser no forma JPEG ou PNG')
                return
            }
        }
    }

    async function handleUpload(image: File) {
        if (!user?.uid) {
            return
        }

        const currentUid = user.uid
        const uidImage = uuidV4()

        const uploadRef = ref(storage, `images/${currentUid}/${uidImage}`)

        uploadBytes(uploadRef, image)
            .then((snapshot) => {
                getDownloadURL(snapshot.ref).then((downloadURL) => {
                    const imageItem = {
                        uid: currentUid,
                        name: uidImage,
                        previewUrl: URL.createObjectURL(image),
                        url: downloadURL
                    }

                    setCarImages((images) => [...images, imageItem])
                })
            })
    }

    async function handleDeleteImage(image: ImageItensProps) {
        const imagePath = `images/${image.uid}/${image.name}`

        const deleteRef = ref(storage, imagePath)

        try {
            let newCarImages = carImages.filter(item => item.url !== image.url)

            setCarImages(newCarImages)
            await deleteObject(deleteRef)
        } catch (err) {
            alert('Erro ao deletar a imagem!')
            console.log(err)
        }
    }

    return (
        <Container>
            <DashboardHeader />

            <div className="w-full bg-white p-3 rounded-lg flex flex-col items-center gap-2 sm:flex-row">
                <button className="border-2 w-48 rounded-lg flex items-center justify-center border-gray-600 h-32">
                    <div className="absolute cursor-pointer">
                        <FiUpload size={30} color="#000" />
                    </div>
                    <div className="cursor-pointer">
                        <input
                            className="opacity-0 cursor-pointer"
                            type="file"
                            accept="image/*"
                            onChange={handleFile} />
                    </div>
                </button>

                {carImages.map(image => (
                    <div key={image.name} className="w-full h-32 flex items-center justify-center relative">
                        <button className="absolute" onClick={() => handleDeleteImage(image)}>
                            <FiTrash size={28} color="#fff" />
                        </button>
                        <img
                            className="rounded-lg w-full h-32 object-cover"
                            src={image.previewUrl}
                            alt="Imagem do Carro"
                        />
                    </div>
                ))}
            </div>

            <div className="w-full bg-white p-3 rounded-lg flex flex-col items-center gap-2 mt-2 sm:flex-row">
                <form
                    className="w-full"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="mb-3">
                        <p className="mb-2 font-medium">Nome do carro</p>

                        <Input
                            name="name"
                            placeholder="Ex: Onix"
                            type="text"
                            register={register}
                            error={errors.name?.message}
                        />
                    </div>

                    <div className="mb-3">
                        <p className="mb-2 font-medium">Modelo</p>

                        <Input
                            name="model"
                            placeholder="Ex: 1.0 Flex Plus Manual"
                            type="text"
                            register={register}
                            error={errors.model?.message}
                        />
                    </div>

                    <div className="w-full flex flex-col items-center mb-3 gap-6 sm:flex-row">
                        <div className="w-full">
                            <p className="mb-2 font-medium">Ano</p>

                            <Input
                                name="year"
                                placeholder="Ex: 2020/2021"
                                type="text"
                                register={register}
                                error={errors.year?.message}
                            />
                        </div>

                        <div className="w-full">
                            <p className="mb-2 font-medium">Km rodados</p>

                            <Input
                                name="km"
                                placeholder="Ex: 10500"
                                type="text"
                                register={register}
                                error={errors.km?.message}
                            />
                        </div>
                    </div>

                    <div className="w-full flex flex-col items-center mb-3 gap-6 sm:flex-row">
                        <div className="w-full">
                            <p className="mb-2 font-medium">Valor em R$</p>

                            <Input
                                name="price"
                                placeholder="Ex: 45000"
                                type="text"
                                register={register}
                                error={errors.price?.message}
                            />
                        </div>

                        <div className="w-full">
                            <p className="mb-2 font-medium">Cidade</p>

                            <Input
                                name="city"
                                placeholder="Ex: São Paulo - SP"
                                type="text"
                                register={register}
                                error={errors.city?.message}
                            />
                        </div>

                        <div className="w-full">
                            <p className="mb-2 font-medium">Telefone / WhatsApp</p>

                            <Input
                                name="whatsapp"
                                placeholder="Ex: 11990901111"
                                type="text"
                                register={register}
                                error={errors.whatsapp?.message}
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <p className="mb-2 font-medium">Descrição</p>

                        <textarea
                            className="w-full border-1 h-24 rounded-md p-2 outline-none resize-none"
                            {...register('description')}
                            name="description"
                            id="description"
                            placeholder="Digite a descrição completa sobre o carro..."
                        />
                        {errors.description?.message && <p className="mb-1 text-red-500">{errors.description?.message}</p>}
                    </div>

                    <button
                        className="w-full text-white font-medium text-lg h-11 bg-zinc-900 rounded-md cursor-pointer"
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
            </div>
        </Container>
    )
}