import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense } from 'react'
import NavBar from './components/NavBar'
import ErrorBoundary from './components/ErrorBoundary'
import { AuthProvider } from './contexts/AuthContext'
import { Loader2 } from 'lucide-react'
import './App.css'

// Importa tus componentes de páginas aquí
import HomePage from './pages/HomePage'
import MoviePage from './pages/MoviePage'
import ShowSelectionPage from './pages/ShowSelectionPage'
import SeatSelectionPage from './pages/SeatSelectionPage'
import PaymentsPage from './pages/PaymentsPage'
import BookingsHistoryPage from './pages/BookingsHistoryPage'
import LoginPage from './pages/LoginPage'

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="min-h-screen">
            {/* NavBar aparece en todas las páginas */}
            <Suspense fallback={
              <div className="flex justify-center items-center p-4">
                <Loader2 className="animate-spin h-6 w-6" />
              </div>
            }>
              <NavBar />
            </Suspense>
            
            {/* Contenido principal que cambia según la ruta */}
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/movie/:movieId" element={<MoviePage />} />
                <Route path="/showtimes/:movieId" element={<ShowSelectionPage />} />
                <Route path="/seats/:showtimeId" element={<SeatSelectionPage />} />
                <Route path="/payment" element={<PaymentsPage />} />
                <Route path="/bookings" element={<BookingsHistoryPage />} />
                {/* Ruta catch-all para páginas no encontradas */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}

// Componente para páginas no encontradas
function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Página no encontrada</h2>
        <p className="text-gray-600 mb-6">La página que buscas no existe.</p>
        <a
          href="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Volver al inicio
        </a>
      </div>
    </div>
  )
}

export default App
