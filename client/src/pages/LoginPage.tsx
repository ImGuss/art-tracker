import { useState } from 'react'
import { useNavigate } from 'react-router'

import axiosInstance from '../api/axiosInstance'
import { useAuth } from '../hooks/useAuth'

const LoginPage = () => {
  // state values
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  // hooks
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    try {
      const res = await axiosInstance.post('/auth/login', { email, password })
  
      login(res.data)
  
      navigate('/')
    } catch (err) {
      setError('Failed to login')
    }
  }

  return (
    <div>Login Page</div>
  )
}

export default LoginPage