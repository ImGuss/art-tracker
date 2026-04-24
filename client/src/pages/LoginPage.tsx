import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import axios from 'axios'

import axiosInstance from '../api/axiosInstance'
import { useAuth } from '../hooks/useAuth'

const LoginPage = () => {
  // state values
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // hooks
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const res = await axiosInstance.post('/auth/login', { email, password })
  
      login(res.data)
  
      navigate('/')
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Failed to login')
      } else {
        setError('Failed to login')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Welcome back</h1>
        <p className="auth-card-subtitle">Sign in to your dashboard</p>
        <form className="auth-form" onSubmit={handleSubmit} aria-label="Login">
          <label htmlFor="login-email">Email</label>
          <input
            type="email"
            id="login-email"
            name="email"
            placeholder="e.g. john@doe.com"
            onChange={(e) => setEmail(e.currentTarget.value)}
            required
            autoComplete="email"
          />

          <label htmlFor="login-password">Password</label>
          <input
            type="password"
            id="login-password"
            name="password"
            placeholder="••••••••"
            onChange={(e) => setPassword(e.currentTarget.value)}
            required
            autoComplete="current-password"
          />

          {
            error ?
            <p
              className="form-error"
              role="alert"
            >
              {error}
            </p> : null
          }

          <button
          className="gold-btn"
            type="submit"
            aria-busy={isSubmitting}
            disabled={isSubmitting}
          >
            Log In
          </button>
        </form>
        
        <p className="auth-switch">
          Don't have an account? <Link className="gold-link" to="/register">Register</Link>
        </p>
      </div>
    </section>
  )
}

export default LoginPage