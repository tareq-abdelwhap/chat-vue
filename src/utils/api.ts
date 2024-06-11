import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
})

export default api
