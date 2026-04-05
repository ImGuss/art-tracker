import { Navigate } from "react-router"
import { useAuth } from "../hooks/useAuth"

const ProtectedRoute = ({children}: {children: React.ReactNode}) => {
  const {user, isLoading} = useAuth()

  if (isLoading) {
    return (
      <p>Loading...</p>
    )
  }

  if (!isLoading && !user) {
    return (
      <Navigate to="/login" replace />
    )
  }

  return (
    <>
      {children}
    </>
  )
}

export default ProtectedRoute