import CitySearch from "../components/CitySearch"
import { Button } from "../components/ui/button"
import { ChevronDown, List, LogOut, Loader2 } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Link, useNavigate } from "react-router-dom"
import React, { Suspense } from "react"
import { useAuth } from "../contexts/AuthContext"

function NavBar() {
  const navigate = useNavigate()
  const { isAuthenticated, user, logout, loading } = useAuth()

  const MovieSearch = React.lazy(() => import("../components/MovieSearch"))
  const userImageUrl = user?.imageUrl || null // luego lo puedes sacar del backend

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <>
      <header>
        <div className="my-2 px-4 sm:px-6 lg:px-8 flex justify-between items-center w-full h-auto">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src="/logo.png" alt="logo" className="h-8 sm:h-10 md:h-14" />
          </Link>

          {/* Buscador de películas - Hidden on small screens */}
          <div className="hidden lg:block flex-1 max-w-md mx-4">
            <Suspense fallback={<Loader2 className="h-4 w-4" />}>
              <MovieSearch />
            </Suspense>
          </div>

          {/* Selector de ciudad - Hidden on small screens */}
          <div className="hidden md:block">
            <CitySearch />
          </div>

          {/* Estado de sesión */}
          <div className="flex items-center gap-2">
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5" />
            ) : isAuthenticated ? (
              <div className="flex items-center">
                {userImageUrl ? (
                  <img
                    src={userImageUrl}
                    alt="User profile"
                    className="h-8 w-8 sm:h-9 sm:w-9 rounded-full"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-sm">
                    U
                  </div>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none self-end align-bottom">
                    <ChevronDown
                      size={20}
                      className="ml-1 hover:cursor-pointer"
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <DropdownMenuItem>
                      <Link
                        to="/bookings"
                        className="flex items-center w-full"
                      >
                        <List size={20} className="mr-2" />
                        <span>Booking History</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center"
                    >
                      <LogOut className="mr-2" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button
                className="rounded-xl px-3 sm:px-4 py-2 sm:py-3 bg-blue-600 text-sm sm:text-base"
                onClick={() => navigate("/login")}
              >
                <span className="hidden sm:inline">Login/Signup</span>
                <span className="sm:hidden">Login</span>
              </Button>
            )}
          </div>
        </div>
        
        {/* Mobile Search - Shows on small screens */}
        <div className="lg:hidden px-4 sm:px-6 pb-4">
          <Suspense fallback={<Loader2 className="h-4 w-4" />}>
            <MovieSearch />
          </Suspense>
        </div>
        
        {/* Mobile City Search - Shows on small screens */}
        <div className="md:hidden px-4 sm:px-6 pb-2">
          <CitySearch />
        </div>
      </header>
      <hr />
    </>
  )
}

export default React.memo(NavBar)
