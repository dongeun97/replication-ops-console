import { AgentRepository } from '../repositories/AgentRepository'
import { Agent } from '../entities/Agent'
import { AgentStatus } from '../types/enums'

// Controller에서 받은 데이터 형태 정의
export interface CreateAgentDto {
  name: string
  ipAddress?: string  // ?는 선택값
  version?: string
}

export interface UpdateAgentDto {
  name?: string
  ipAddress?: string
  version?: string
  status?: AgentStatus
}

export class AgentService {

  async getAll(): Promise<Agent[]> {
    return AgentRepository.findAll()
  }

  async getById(id: string): Promise<Agent> {
    const agent = await AgentRepository.findById(id)
    if (!agent) throw new Error(`Agent not found: ${id}`) // 없으면 에러 던짐 → controller에서 404 처리
    return agent
  }

  async create(dto: CreateAgentDto): Promise<Agent> {
    // 중복 이름 체크
    const exists = await AgentRepository.findByName(dto.name)
    if (exists) throw new Error(`Agent name already exists: ${dto.name}`)

    return AgentRepository.createAgent({
      ...dto,
      status: AgentStatus.OFFLINE, // 처음 등록은 항상 OFFLINE
    })
  }

  async update(id: string, dto: UpdateAgentDto): Promise<Agent> {
    await this.getById(id) // 존재 확인
    const updated = await AgentRepository.updateAgent(id, dto)
    if (!updated) throw new Error(`Failed to update agent: ${id}`)
    return updated
  }

  async delete(id: string): Promise<void> {
    await this.getById(id) // 존재 확인
    const deleted = await AgentRepository.deleteAgent(id)
    if (!deleted) throw new Error(`Failed to delete agent: ${id}`)
  }

  async heartbeat(id: string): Promise<Agent> {
    await this.getById(id) // 존재 확인
    const updated = await AgentRepository.updateAgent(id, {
      status: AgentStatus.ONLINE,
      lastSeenAt: new Date(), // 현재 시간으로 갱신
    })
    if (!updated) throw new Error(`Failed to update heartbeat: ${id}`)
    return updated
  }
}

export const agentService = new AgentService()