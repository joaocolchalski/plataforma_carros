import { useContext, useEffect, useState } from "react";
import Container from "../../components/Container";
import DashboardHeader from "../../components/DashboardHeader";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { db, storage } from "../../services/firebaseConnection";
import { AuthContext } from "../../contexts/auth";
import SpinnerLoading from "../../components/SpinnerLoading";
import { Link } from "react-router";
import { FiTrash2 } from "react-icons/fi";
import { deleteObject, ref } from 'firebase/storage'

interface CarImageProps {
    uid: string,
    name: string,
    url: string
}

interface CarProps {
    id: string,
    name: string,
    year: string,
    userUid: string,
    model: string,
    price: string | number,
    city: string,
    km: string | number,
    images: CarImageProps[]
}

export default function Dashboard() {
    const [cars, setCars] = useState<CarProps[]>([])
    const [loadImages, setLoadImages] = useState<string[]>([])

    const { user } = useContext(AuthContext)

    useEffect(() => {
        async function loadCars() {
            if (!user?.uid) {
                return
            }

            const collectionRef = collection(db, 'cars')
            const queryRef = query(collectionRef, orderBy('createdAt', 'desc'), where('userUid', '==', user?.uid))

            onSnapshot(queryRef, (cars) => {
                let listCars = [] as CarProps[]

                cars.forEach(car => {
                    listCars.push({
                        id: car.id,
                        name: car.data().name,
                        model: car.data().model,
                        year: car.data().year,
                        km: Number(car.data().km).toLocaleString('pt-BR'),
                        price: Number(car.data().price).toLocaleString('pt-BR'),
                        city: car.data().city,
                        images: car.data().images,
                        userUid: car.data().userUid
                    })
                })

                setCars(listCars)
            })
        }

        loadCars()
    }, [user])

    function handleImageLoad(id: string) {
        setLoadImages((prevImageLoaded) => [...prevImageLoaded, id])
    }

    async function handleDeleteCar(car: CarProps) {
        const docRef = doc(db, 'cars', car.id)

        await deleteDoc(docRef)
            .then(() => {
                deleteCarImages(car.images)
                alert('Carro deletado com sucesso!')
            })
            .catch((err) => {
                alert('Erro ao deletar o carro!')
                console.log(err)
            })
    }

    function deleteCarImages(images: CarImageProps[]) {
        images.forEach(async (image) => {
            const imagePath = `images/${image.uid}/${image.name}`
            const imageRef = ref(storage, imagePath)

            try {
                await deleteObject(imageRef)
            } catch (err) {
                alert('Erro ao deletar a imagem!')
                console.log(err)
            }
        })
    }

    return (
        <Container>
            <DashboardHeader />

            {cars.length === 0 ? (
                <div className="w-full flex justify-center font-bold text-lg">
                    <span>Você não cadastrou nenhum carro!</span>
                </div>
            ) : (
                <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {cars.map(car => (
                        <Link key={car.id} to={`/car/${car.id}`}>
                            <section key={car.id} className="w-full bg-white rounded-lg relative">
                                <button
                                    className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md z-50"
                                    onClick={(event) => {
                                        event.preventDefault()
                                        event.stopPropagation()
                                        handleDeleteCar(car)
                                    }}
                                >
                                    <FiTrash2 size={26} />
                                </button>

                                <div
                                    className="w-full h-72 rounded-lg bg-slate-200 flex justify-center items-center"
                                    style={{ display: loadImages.includes(car.id) ? 'none' : 'flex' }}
                                >
                                    <SpinnerLoading />
                                </div>
                                <img
                                    className="w-full rounded-lg mb-2 max-h-72 object-cover hover:scale-105 transition-all"
                                    src={car.images[0].url}
                                    alt="Carro"
                                    onLoad={() => handleImageLoad(car.id)}
                                    style={{ display: loadImages.includes(car.id) ? 'block' : 'none' }}
                                />
                                <p
                                    className="font-bold mt-1 mb-2 px-2"
                                >
                                    {car.name}
                                </p>

                                <div className="flex flex-col px-2">
                                    <span className="text-zinc-700 mb-6">{car.year} | {car.km} km</span>
                                    <strong className="text-black font-bold text-xl">R$ {car.price}</strong>
                                </div>

                                <div className="w-full h-px bg-slate-300 my-2"></div>

                                <div className="px-2 pb-2">
                                    <span className="text-zinc-700">
                                        {car.city}
                                    </span>
                                </div>
                            </section>
                        </Link>
                    ))}
                </main>
            )}


        </Container>
    )
}