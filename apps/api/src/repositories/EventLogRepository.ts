import { AppDataSource } from '../config/database'
import { EventLog } from '../entities/EventLog'
import { LogLevel } from '../types/enums'

export const EventLogRepository = AppDataSource.getRepository(EventLog).extend({

  async findAll(limit = 100): Promise<EventLog[]> {
    return this.find({
      relations: ['agent', 'job'], // agent, job 정보도 JOIN해서 같이 가져옴
      order: { createdAt: 'DESC' },
      take: limit, // SQL의 LIMIT. 로그는 쌓이면 많아지니까 기본 100개만 가져옴
    })
  },

  async findById(id: string): Promise<EventLog | null> {
    return this.findOne({
      where: { id },
      relations: ['agent', 'job'],
    })
  },

  async findByJobId(jobId: string): Promise<EventLog[]> {
    return this.find({
      where: { job: { id: jobId } },
      relations: ['agent', 'job'],
      order: { createdAt: 'DESC' },
    })
  },

  async findByAgentId(agentId: string): Promise<EventLog[]> {
    return this.find({
      where: { agent: { id: agentId } },
      relations: ['agent', 'job'],
      order: { createdAt: 'DESC' },
    })
  },

  async findByLevel(level: LogLevel): Promise<EventLog[]> {
    return this.find({
      where: { level },
      relations: ['agent', 'job'],
      order: { createdAt: 'DESC' },
    })
  },

  async createLog(data: Partial<EventLog>): Promise<EventLog> {
    const log = this.create(data)
    return this.save(log)
  },
})