import React, {useState} from 'react'
import { useNavigate, Link } from 'react-router'
import axios from 'axios'

import axiosInstance from '../api/axiosInstance'
import { useAuth } from '../hooks/useAuth'

const RegisterPage = () => {
  // state values
  const [username, setUsername] = useState('')
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
      const res = await axiosInstance.post('/auth/register', {email, username, password})

      login(res.data)

      navigate('/')
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || 'Failed to register')
      } else {
        setError('Failed to register')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Create an account</h1>
        <p className="auth-card-subtitle">
          Start tracking your favorite art
        </p>
        <form className="auth-form" onSubmit={handleSubmit} aria-label="Register">
          <label htmlFor="register-username">Username</label>
          <input
            type="text"
            id="register-username"
            name="username"
            onChange={(e) => setUsername(e.currentTarget.value)}
            required
            autoComplete="username"
          />

          <label htmlFor="register-email">Email</label>
          <input
            type="email"
            id="register-email"
            name="email"
            placeholder="e.g. john@doe.com"
            onChange={(e) => setEmail(e.currentTarget.value)}
            required
            autoComplete="email"
          />

          <label htmlFor="register-password">Password</label>
          <input
            type="password"
            id="register-password"
            name="password"
            onChange={(e) => setPassword(e.currentTarget.value)}
            required
            autoComplete="new-password"
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
            Register
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link className="gold-link" to="/login">Login</Link>
        </p>
      </div>
    </section>
  )
}

export default RegisterPage