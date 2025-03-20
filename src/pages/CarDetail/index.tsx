import { doc, getDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { db } from "../../services/firebaseConnection"
import Container from "../../components/Container"
import SpinnerLoading from "../../components/SpinnerLoading"
import { FaWhatsapp } from "react-icons/fa"

import { Swiper, SwiperSlide } from 'swiper/react';
import toast from "react-hot-toast"

interface CarImageProps {
    uid: string,
    name: string,
    url: string
}

interface CarProps {
    id: string,
    name: string,
    model: string,
    price: string | number,
    year: string,
    city: string,
    km: string | number,
    images: CarImageProps[],
    whatsapp: string,
    description: string,
    owner: string,
    userUid: string
}

export default function CarDetail() {
    const { id } = useParams()
    const [car, setCar] = useState<CarProps | null>(null)
    const [loading, setLoading] = useState(true)
    const [sliderPerView, setSliderPerView] = useState<number>(2)

    useEffect(() => {
        async function loadCar() {
            if (!id) {
                return
            }

            const docRef = doc(db, 'cars', id)

            await getDoc(docRef)
                .then(snapshot => {
                    if (!snapshot.data()) {
                        setCar(null)
                        setLoading(false)
                        return
                    }

                    setCar({
                        id: snapshot.id,
                        city: snapshot.data()?.city,
                        description: snapshot.data()?.description,
                        images: snapshot.data()?.images,
                        km: Number(snapshot.data()?.km).toLocaleString('pt-BR'),
                        model: snapshot.data()?.model,
                        name: snapshot.data()?.name,
                        price: Number(snapshot.data()?.price).toLocaleString('pt-BR'),
                        whatsapp: snapshot.data()?.whatsapp,
                        year: snapshot.data()?.year,
                        owner: snapshot.data()?.owner,
                        userUid: snapshot.data()?.userUid
                    })

                    setLoading(false)
                })
                .catch((err) => {
                    toast.error('Erro ao encontrar o carro!')
                    console.log(err)
                    setLoading(false)
                    setCar(null)
                })
        }

        loadCar()
    }, [id])

    useEffect(() => {
        function handleResize() {
            if (window.innerWidth < 720) {
                setSliderPerView(1)
            } else {
                setSliderPerView(2)
            }
        }

        handleResize()

        window.addEventListener('resize', handleResize)

        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    if (loading) {
        return (
            <div className="w-full h-[calc(100vh-80px)] flex justify-center items-center">
                <SpinnerLoading />
            </div>
        )
    }

    return (
        <Container>
            {!car ? (
                <div className="w-full flex justify-center font-bold text-lg">
                    <span>Carro não encontrado!</span>
                </div>
            ) : (
                <>
                    <Swiper
                        slidesPerView={car?.images.length > 1 ? sliderPerView : 1}
                        pagination={{ clickable: true }}
                        navigation
                    >
                        {car?.images.map(image => (
                            <SwiperSlide key={image.name}>
                                <img
                                    className="w-full h-96 object-cover"
                                    src={image.url}
                                    alt="Imagem do Carro"
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <main className="w-full bg-white rounded-lg p-6 my-4">
                        <div className="flex flex-col sm:flex-row mb-4 items-center justify-between">
                            <h1 className="font-bold text-3xl text-black">{car?.name}</h1>
                            <h1 className="font-bold text-3xl text-black">R$ {car?.price}</h1>
                        </div>

                        <p>{car?.model}</p>

                        <div className="w-full flex gap-6 my-4">
                            <div className="flex flex-col gap-4">
                                <div>
                                    <p>Cidade</p>
                                    <strong>{car?.city}</strong>
                                </div>
                                <div>
                                    <p>Ano</p>
                                    <strong>{car?.year}</strong>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div>
                                    <p>KM</p>
                                    <strong>{car?.km}</strong>
                                </div>
                            </div>
                        </div>

                        <strong>Descrição</strong>
                        <p className="mb-4">{car?.description}</p>

                        <strong>Telefone / Whatsapp</strong>
                        <p className="mb-6">{car?.whatsapp}</p>

                        <a
                            className="bg-green-500 w-full h-11 rounded-md text-white font-medium text-xl flex items-center justify-center gap-2"
                            href={`https://api.whatsapp.com/send?phone=${car?.whatsapp}&text=Olá ${car?.owner}, vi esse ${car?.name} a venda na WebCarros, e fiquei interessado!`}
                            target="_blank"
                        >
                            Conversar com Vendedor <FaWhatsapp size={26} color="#fff" />
                        </a>
                    </main>
                </>
            )}
        </Container>
    )
}