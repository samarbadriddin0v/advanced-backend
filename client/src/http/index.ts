import axios from 'axios'

export const API_URL = `http://localhost:8080`

const $axios = axios.create({
	withCredentials: true,
	baseURL: `${API_URL}/api`,
})

export default $axios
