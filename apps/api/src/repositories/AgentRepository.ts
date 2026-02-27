import { AppDataSource } from '../config/database'
import { Agent } from '../entities/Agent'
import { AgentStatus } from '../types/enums'

export const AgentRepository = AppDataSource.getRepository(Agent).extend({

  async findAll(): Promise<Agent[]> {
    return this.find({ order: { createdAt: 'DESC' } })
  },

  async findById(id: string): Promise<Agent | null> {
    return this.findOneBy({ id })
  },

  async findByName(name: string): Promise<Agent | null> {
    return this.findOneBy({ name })
  },

  async findOnlineAgents(): Promise<Agent[]> {
    return this.findBy({ status: AgentStatus.ONLINE })
  },

  async createAgent(data: Partial<Agent>): Promise<Agent> {
    const agent = this.create(data)
    return this.save(agent)
  },

  async updateAgent(id: string, data: Partial<Agent>): Promise<Agent | null> {
    await this.update(id, data)
    return this.findById(id)
  },

  async deleteAgent(id: string): Promise<boolean> {
    const result = await this.delete(id)
    return (result.affected ?? 0) > 0 // 실제로 삭제된 row가 있으면 true
  },
})