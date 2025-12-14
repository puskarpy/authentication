import { Navigate, useLocation, Outlet } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

export default function ProtectedRoute() {

    const {auth} = useAuth()
    const location = useLocation()

  return (
    auth?.user
    ? <Outlet/>
    : <Navigate to={'/login'} state={{from: location}} replace/>
  )
}
