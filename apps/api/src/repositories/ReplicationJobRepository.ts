import { AppDataSource } from '../config/database'
import { ReplicationJob } from '../entities/ReplicationJob'
import { JobStatus } from '../types/enums'

export const ReplicationJobRepository = AppDataSource.getRepository(ReplicationJob).extend({

  async findAll(): Promise<ReplicationJob[]> {
    return this.find({
      relations: ['agent'], // agent 필드를 JOIN해서 같이 가져옴 (JPA의 fetch join 같은 것)
      order: { createdAt: 'DESC' },
    })
  },

  async findById(id: string): Promise<ReplicationJob | null> {
    return this.findOne({
      where: { id },
      relations: ['agent'],
    })
  },

  async findByStatus(status: JobStatus): Promise<ReplicationJob[]> {
    return this.find({
      where: { status },
      relations: ['agent'],
    })
  },

  async findByAgentId(agentId: string): Promise<ReplicationJob[]> {
    return this.find({
      where: { agent: { id: agentId } },
      relations: ['agent'],
    })
  },

  async createJob(data: Partial<ReplicationJob>): Promise<ReplicationJob> {
    const job = this.create(data)
    return this.save(job)
  },

  async updateJob(id: string, data: Partial<ReplicationJob>): Promise<ReplicationJob | null> {
    await this.update(id, data)
    return this.findById(id)
  },

  async deleteJob(id: string): Promise<boolean> {
    const result = await this.delete(id)
    return (result.affected ?? 0) > 0
  },
})