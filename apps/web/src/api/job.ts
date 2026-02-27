import axios from 'axios'

const BASE_URL = 'http://localhost:3000/api/v1'

export const jobApi = {

  // 전체 Job 목록 조회
  getAll: () => axios.get(`${BASE_URL}/jobs`),

  // 특정 Job 조회
  getById: (id: string) => axios.get(`${BASE_URL}/jobs/${id}`),

  // Job 생성
  create: (data: { name: string; mode: string; sourcePath: string; targetPath: string; agentId?: string; rpoSeconds?: number }) =>
    axios.post(`${BASE_URL}/jobs`, data),

  // Job 수정
  update: (id: string, data: object) =>
    axios.patch(`${BASE_URL}/jobs/${id}`, data),

  // Job 삭제
  delete: (id: string) => axios.delete(`${BASE_URL}/jobs/${id}`),

  // Job 시작
  start: (id: string) => axios.post(`${BASE_URL}/jobs/${id}/start`),

  // Job 일시정지
  pause: (id: string) => axios.post(`${BASE_URL}/jobs/${id}/pause`),
}