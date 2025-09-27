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

function NavBar() {
  const navigate = useNavigate()

  const MovieSearch = React.lazy(() => import("../components/MovieSearch"))

  
  const isAuthenticated = !!localStorage.getItem("token")
  const userImageUrl = null // luego lo puedes sacar del backend
  const loading = false

  return (
    <>
      <header>
        <div className="my-2 px-8 flex justify-between items-center w-full h-auto">
          {/* Logo */}
          <Link to="/">
            <img src="/logo.png" alt="logo" className="h-10 md:h-14" />
          </Link>

          {/* Buscador de películas */}
          <Suspense fallback={<Loader2 />}>
            <MovieSearch />
          </Suspense>

          {/* Selector de ciudad */}
          <CitySearch />

          {/* Estado de sesión */}
          {loading ? (
            <Loader2 className="animate-spin h-5 w-5" />
          ) : isAuthenticated ? (
            <div className="flex items-center">
              {userImageUrl ? (
                <img
                  src={userImageUrl}
                  alt="User profile"
                  className="h-9 w-9 rounded-full"
                  loading="lazy"
                />
              ) : (
                <div className="h-9 w-9 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
                  U
                </div>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none self-end align-bottom">
                  <ChevronDown
                    size={24}
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
                    onClick={() => {
                      localStorage.removeItem("token")
                      navigate("/login")
                    }}
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
              className="rounded-xl px-4 py-3 bg-blue-600"
              onClick={() => navigate("/login")}
            >
              Login/Signup
            </Button>
          )}
        </div>
      </header>
      <hr />
    </>
  )
}

export default React.memo(NavBar)
