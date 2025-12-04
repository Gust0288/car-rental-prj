import axios from 'axios'

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})


httpClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)


httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status
    const suppress = !!error.config?.suppressAuthRedirect

    if (status === 401 && !suppress) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')

      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
