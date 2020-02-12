import axios from 'axios'

const api = axios.create({
    baseURL: 'https://0f5aaaad.ngrok.io/api'
})

api.interceptors.request.use(
    async config => {
        return config
    },
    error => {
        return Promise.reject(error)
    })

export default api