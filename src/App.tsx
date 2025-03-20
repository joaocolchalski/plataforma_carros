import { BrowserRouter } from "react-router"
import AppRoutes from "./routes"
import AuthProvider from "./contexts/auth"
import { Toaster } from 'react-hot-toast'

import { register } from 'swiper/element/bundle'

register()
import 'swiper/swiper-bundle.css'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 2500
          }}
        />
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}