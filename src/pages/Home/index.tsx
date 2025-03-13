import Container from "../../components/Container"

export default function Home() {
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

            <main>
                <section>
                    <img
                        src="https://image.webmotors.com.br/_fotos/anunciousados/gigante/2025/202503/20250313/honda-civic-2-0-di-vtec-turbo-gasolina-type-r-manual-wmimagem14481999164.webp?s=fill&w=552&h=414&q=60"
                        alt="Carro"
                    />
                    <p>HONDA CIVIC</p>

                    <div>
                        <span>2024/2024 | 23.000 km</span>
                        <strong>R$190.000</strong>
                    </div>

                    <div></div>

                    <div>
                        <span>
                            Campo Grande - MS
                        </span>
                    </div>
                </section>
            </main>
        </Container>
    )
}