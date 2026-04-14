import { createContext, useEffect, useState } from 'react'
import axiosInstance from '../api/axiosInstance'

import type { User } from '../types/user';

interface AuthContextType  {
  user: User | null;
  isLoading: boolean;
  login: (user: User) => void;
  logout: () => void;
}
  
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  login: () => {},
  logout: () => {}
})

const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get('/auth/me')
  
        setUser(res.data)
      } catch (err) {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    } 
    
    fetchData()
  }, [])
  
  const login = (user: User) => {
    setUser(user)
  }

  const logout = async () => {
    await axiosInstance.post('/auth/logout')
    
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{user, isLoading, login, logout}}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider