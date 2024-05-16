import axios from 'axios'

export const API_URL = `http://localhost:8080/api`

const $axios = axios.create({
	withCredentials: true,
	baseURL: API_URL,
})

export default $axios
