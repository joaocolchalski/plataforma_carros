import { useParams } from "react-router"

export default function CarDetail() {
    const { id } = useParams()

    return (
        <div>
            <h1>Página CarDetail {id}</h1>
        </div>
    )
}