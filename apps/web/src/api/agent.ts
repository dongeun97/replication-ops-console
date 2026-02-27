import axios from 'axios'

// API 서버 주소
const BASE_URL = 'http://localhost:3000/api/v1'

export const agentApi = {

  // 전체 Agent 목록 조회
  getAll: () => axios.get(`${BASE_URL}/agents`),

  // 특정 Agent 조회
  getById: (id: string) => axios.get(`${BASE_URL}/agents/${id}`),

  // Agent 등록
  create: (data: { name: string; ipAddress?: string; version?: string }) =>
    axios.post(`${BASE_URL}/agents`, data),

  // Agent 수정
  update: (id: string, data: object) =>
    axios.patch(`${BASE_URL}/agents/${id}`, data),

  // Agent 삭제
  delete: (id: string) => axios.delete(`${BASE_URL}/agents/${id}`),

  // Heartbeat
  heartbeat: (id: string) => axios.post(`${BASE_URL}/agents/${id}/heartbeat`),
}