import { BrowserRouter } from "react-router"
import AppRoutes from "./routes"
import AuthProvider from "./contexts/auth"

import { register } from 'swiper/element/bundle'

register()
import 'swiper/swiper-bundle.css'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}