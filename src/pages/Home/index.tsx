import { useEffect, useState } from "react"
import Container from "../../components/Container"
import { collection, getDocs, orderBy, query } from "firebase/firestore"
import { db } from "../../services/firebaseConnection"
import { Link } from "react-router"
import SpinnerLoading from "../../components/SpinnerLoading"

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

export default function Home() {
    const [cars, setCars] = useState<CarProps[]>([])
    const [loadImages, setLoadImages] = useState<string[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadCars() {
            const collectionRef = collection(db, 'cars')

            const queryRef = query(collectionRef, orderBy('createdAt', "desc"))

            await getDocs(queryRef)
                .then((cars) => {
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
                    setLoading(false)
                })
                .catch((err) => {
                    alert('Erro ao carregar os carros!')
                    console.log(err)
                    setLoading(false)
                })
        }

        loadCars()
    }, [])

    function handleImageLoad(id: string) {
        setLoadImages((prevImageLoaded) => [...prevImageLoaded, id])
    }

    if (loading) {
        return (
            <div className="w-full h-[calc(100vh-80px)] flex justify-center items-center">
                <SpinnerLoading />
            </div>
        )
    }

    return (
        <Container>
            <section className="bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex justify-center items-center gap-2">
                <input
                    placeholder="Digite o nome do carro..."
                    className="w-full border-1 rounded-lg h-9 px-3 outline-none"
                />
                <button
                    className="bg-red-500 h-9 px-8 rounded-lg text-white font-medium text-lg"
                >
                    Buscar
                </button>
            </section>

            <h1
                className="font-bold text-center mt-6 text-2xl mb-4"
            >
                Carros novos e usados em todo o Brasil
            </h1>

            {cars.length === 0 ? (
                <div className="w-full flex justify-center font-bold text-lg">
                    <span>Não há carros cadastrados!</span>
                </div>
            ) : (
                <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {cars.map(car => (
                        <Link key={car.id} to={`/car/${car.id}`}>
                            <section key={car.id} className="w-full bg-white rounded-lg">
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
        </Container >
    )
}