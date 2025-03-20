import { useEffect, useState } from "react"
import Container from "../../components/Container"
import { collection, getDocs, limit, orderBy, Query, query, QueryDocumentSnapshot, QuerySnapshot, startAfter, where } from "firebase/firestore"
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
    const [loadImages, setLoadImages] = useState<Set<string>>()
    const [loading, setLoading] = useState(true)
    const [lastCar, setLastCar] = useState<QueryDocumentSnapshot>()
    const [isEmpty, setIsEmpty] = useState(false)
    const [inputSearchCar, setInputSearchCar] = useState('')

    useEffect(() => {
        loadCars()
    }, [])

    useEffect(() => {
        handleSearchCar()
    }, [inputSearchCar])

    async function loadCars() {
        const collectionRef = collection(db, 'cars')
        const queryRef = query(collectionRef, orderBy('createdAt', "desc"), limit(12));
        const querySnapshot = await getDocs(queryRef)
        handleListCars(querySnapshot, true)
    }

    async function handleSearchCar() {
        if (inputSearchCar.trim() === '') {
            loadCars()
            setIsEmpty(false)
            return
        }

        const collectionRef = collection(db, 'cars')
        const queryRef = query(
            collectionRef,
            orderBy('createdAt', 'desc'),
            where('name', '>=', inputSearchCar.toUpperCase()),
            where('name', '<=', inputSearchCar.toUpperCase() + '\uf8ff'),
            limit(12)
        )

        const querySnapshot = await getDocs(queryRef)
        setCars([])
        handleListCars(querySnapshot, true)
    }

    function handleListCars(cars: QuerySnapshot, reset = false) {
        if (cars.empty) {
            setIsEmpty(true)
            setLoading(false)
            return
        }

        const listCars = cars.docs.map(car => ({
            id: car.id,
            name: car.data().name,
            model: car.data().model,
            year: car.data().year,
            km: Number(car.data().km).toLocaleString('pt-BR'),
            price: Number(car.data().price).toLocaleString('pt-BR'),
            city: car.data().city,
            images: car.data().images,
            userUid: car.data().userUid
        }))

        setCars(prevCars => reset ? listCars : [...prevCars, ...listCars])
        setLastCar(cars.docs[cars.docs.length - 1])
        setLoading(false)
    }

    async function handleMoreCars() {
        if (!lastCar) return

        const collectionRef = collection(db, 'cars')
        let queryRef: Query;

        if (inputSearchCar.trim().length > 0) {
            queryRef = query(
                collectionRef,
                orderBy('createdAt', 'desc'),
                where('name', '>=', inputSearchCar.toUpperCase()),
                where('name', '<=', inputSearchCar.toUpperCase() + '\uf8ff'),
                startAfter(lastCar),
                limit(12)
            )
        } else {
            queryRef = query(collectionRef, orderBy('createdAt', 'desc'), startAfter(lastCar), limit(12))
        }

        const querySnapshot = await getDocs(queryRef)

        handleListCars(querySnapshot)
    }

    function handleImageLoad(id: string) {
        setLoadImages(prevImagesName => new Set(prevImagesName).add(id))
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
            <section
                className="bg-white p-4 rounded-lg w-full max-w-3xl mx-auto flex gap-2 justify-center items-center"
            >
                <input
                    type="text"
                    placeholder="Digite o nome do carro que procura..."
                    className="w-full border-1 rounded-lg h-9 px-3 outline-none"
                    value={inputSearchCar}
                    onChange={e => setInputSearchCar(e.target.value)}
                />
            </section>

            <h1
                className="font-bold text-center mt-6 text-2xl mb-4"
            >
                Carros novos e usados em todo o Brasil
            </h1>

            {cars.length === 0 ? (
                <div className="w-full flex justify-center font-bold text-lg">
                    <span>Nenhum carro encontrado!</span>
                </div>
            ) : (
                <>
                    <main className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {cars.map(car => (
                            <Link key={car.id} to={`/car/${car.id}`}>
                                <section key={car.id} className="w-full bg-white rounded-lg">
                                    <div
                                        className="w-full h-72 mb-2 rounded-lg bg-slate-200 flex justify-center items-center"
                                    >
                                        {!loadImages?.has(car.id) && <SpinnerLoading />}

                                        <img
                                            className="w-full rounded-lg h-72 object-cover hover:scale-105 transition-all"
                                            src={car.images[0].url}
                                            alt="Carro"
                                            onLoad={() => handleImageLoad(car.id)}
                                            style={{ display: loadImages?.has(car.id) ? 'block' : 'none' }}
                                        />
                                    </div>

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

                    {!isEmpty && (
                        <div className="w-full flex justify-center mt-6">
                            <button
                                className="bg-red-500 h-9 px-8 rounded-lg text-white font-medium text-lg"
                                onClick={() => handleMoreCars()}
                            >
                                Buscar Mais
                            </button>
                        </div>
                    )}
                </>
            )}
        </Container >
    )
}