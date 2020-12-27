import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000/'
})

api.interceptors.request.use(
  async config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

export default api
