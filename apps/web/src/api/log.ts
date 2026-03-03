import axios from 'axios'

const BASE_URL = 'http://localhost:3000/api/v1'

export const logApi = {
  getAll: (limit?: number) => axios.get(`${BASE_URL}/logs`, { params: { limit } }),
  getById: (id: string) => axios.get(`${BASE_URL}/logs/${id}`),
  create: (data: { level: string; message: string; jobId?: string; agentId?: string }) =>
    axios.post(`${BASE_URL}/logs`, data),
}