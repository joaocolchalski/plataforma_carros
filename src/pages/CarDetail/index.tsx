import { doc, getDoc } from "firebase/firestore"
import { useEffect, useState } from "react"
import { useParams } from "react-router"
import { db } from "../../services/firebaseConnection"
import Container from "../../components/Container"
import SpinnerLoading from "../../components/SpinnerLoading"
import { FaWhatsapp } from "react-icons/fa"

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

    useEffect(() => {
        async function loadCar() {
            if (!id) {
                return
            }

            const docRef = doc(db, 'cars', id)

            await getDoc(docRef)
                .then(snapshot => {
                    let data = {
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
                    }

                    console.log(data)
                    setCar(data)
                    setLoading(false)
                })
                .catch((err) => {
                    alert('Erro ao encontrar o carro!')
                    console.log(err)
                    setLoading(false)
                    setCar(null)
                })
        }

        loadCar()
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
            {!car?.name ? (
                <div className="w-full flex justify-center font-bold text-lg">
                    <span>Carro não encontrado!</span>
                </div>
            ) : (
                <>
                    <h1>SLIDER</h1>

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
                            href="#"
                        >
                            Conversar com Vendedor <FaWhatsapp size={26} color="#fff" />
                        </a>
                    </main>
                </>
            )}
        </Container>
    )
}