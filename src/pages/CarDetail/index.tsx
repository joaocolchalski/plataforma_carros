import { doc, getDoc } from "firebase/firestore"
import { useEffect } from "react"
import { useParams } from "react-router"
import { db } from "../../services/firebaseConnection"

export default function CarDetail() {
    const { id } = useParams()

    useEffect(() => {
        async function loadCar() {
            if (!id) {
                return
            }

            const docRef = doc(db, 'cars', id)

            await getDoc(docRef)
        }

        loadCar()
    }, [])

    return (
        <div>
            <h1>Página CarDetail {id}</h1>
        </div>
    )
}