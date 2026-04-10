import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: '/api',
  timeout: 1000,
  headers: {
    withCredentials: true,
    'Content-Type': 'application/json'
  }
})

export default axiosInstance