import { EventLogRepository } from '../repositories/EventLogRepository'
import { AgentRepository } from '../repositories/AgentRepository'
import { ReplicationJobRepository } from '../repositories/ReplicationJobRepository'
import { EventLog } from '../entities/EventLog'
import { LogLevel } from '../types/enums'

// Controller에서 받은 데이터 형태 정의
export interface CreateLogDto {
  level: LogLevel    // INFO, WARN, ERROR
  message: string    // 로그 메시지
  jobId?: string     // 어떤 Job의 로그인지 (선택)
  agentId?: string   // 어떤 Agent의 로그인지 (선택)
}

export class EventLogService {

  async getAll(limit?: number): Promise<EventLog[]> {
    return EventLogRepository.findAll(limit)
  }

  async getById(id: string): Promise<EventLog> {
    const log = await EventLogRepository.findById(id)
    if (!log) throw new Error(`EventLog not found: ${id}`) // 없으면 에러 → controller에서 404 처리
    return log
  }

  async create(dto: CreateLogDto): Promise<EventLog> {
    const data: Partial<EventLog> = {
      level: dto.level,
      message: dto.message,
    }

    // jobId가 있으면 해당 Job 찾아서 연결
    if (dto.jobId) {
      const job = await ReplicationJobRepository.findById(dto.jobId)
      if (!job) throw new Error(`Job not found: ${dto.jobId}`)
      data.job = job
    }

    // agentId가 있으면 해당 Agent 찾아서 연결
    if (dto.agentId) {
      const agent = await AgentRepository.findById(dto.agentId)
      if (!agent) throw new Error(`Agent not found: ${dto.agentId}`)
      data.agent = agent
    }

    return EventLogRepository.createLog(data)
  }
}

export const eventLogService = new EventLogService()