import { ReplicationJobRepository } from '../repositories/ReplicationJobRepository'
import { AgentRepository } from '../repositories/AgentRepository'
import { ReplicationJob } from '../entities/ReplicationJob'
import { JobStatus, ReplicationMode } from '../types/enums'

// Controller에서 받은 데이터 형태 정의 (Java의 DTO 같은 것)
export interface CreateJobDto {
  name: string
  mode: ReplicationMode        // FILE 또는 BLOCK
  sourcePath: string           // 복제 원본 경로
  targetPath: string           // 복제 대상 경로
  agentId?: string             // 어떤 Agent가 실행할지 (선택)
  rpoSeconds?: number          // 복제 주기 (초 단위, 선택)
}

export interface UpdateJobDto {
  name?: string
  sourcePath?: string
  targetPath?: string
  agentId?: string
  rpoSeconds?: number
}

export class ReplicationJobService {

  async getAll(): Promise<ReplicationJob[]> {
    return ReplicationJobRepository.findAll()
  }

  async getById(id: string): Promise<ReplicationJob> {
    const job = await ReplicationJobRepository.findById(id)
    if (!job) throw new Error(`Job not found: ${id}`) // 없으면 에러 → controller에서 404 처리
    return job
  }

  async create(dto: CreateJobDto): Promise<ReplicationJob> {
    const data: Partial<ReplicationJob> = {
      name: dto.name,
      mode: dto.mode,
      sourcePath: dto.sourcePath,
      targetPath: dto.targetPath,
      status: JobStatus.READY, // 처음 생성은 항상 READY
      rpoSeconds: dto.rpoSeconds ?? null,
    }

    // agentId가 있으면 해당 Agent 찾아서 연결
    if (dto.agentId) {
      const agent = await AgentRepository.findById(dto.agentId)
      if (!agent) throw new Error(`Agent not found: ${dto.agentId}`)
      data.agent = agent
    }

    return ReplicationJobRepository.createJob(data)
  }

  async update(id: string, dto: UpdateJobDto): Promise<ReplicationJob> {
    const job = await this.getById(id) // 존재 확인
    if (job.status === JobStatus.RUNNING) {
      throw new Error('실행 중인 Job은 수정할 수 없습니다') // RUNNING 상태면 수정 불가
    }

    const data: Partial<ReplicationJob> = { ...dto }

    if (dto.agentId) {
      const agent = await AgentRepository.findById(dto.agentId)
      if (!agent) throw new Error(`Agent not found: ${dto.agentId}`)
      data.agent = agent
    }

    const updated = await ReplicationJobRepository.updateJob(id, data)
    if (!updated) throw new Error(`Failed to update job: ${id}`)
    return updated
  }

  async delete(id: string): Promise<void> {
    const job = await this.getById(id) // 존재 확인
    if (job.status === JobStatus.RUNNING) {
      throw new Error('실행 중인 Job은 삭제할 수 없습니다') // RUNNING 상태면 삭제 불가
    }
    const deleted = await ReplicationJobRepository.deleteJob(id)
    if (!deleted) throw new Error(`Failed to delete job: ${id}`)
  }

  async start(id: string): Promise<ReplicationJob> {
    const job = await this.getById(id)
    if (job.status === JobStatus.RUNNING) {
      throw new Error('이미 실행 중인 Job입니다')
    }
    // READY 또는 PAUSED 상태일 때만 시작 가능
    const updated = await ReplicationJobRepository.updateJob(id, {
      status: JobStatus.RUNNING,
    })
    if (!updated) throw new Error(`Failed to start job: ${id}`)
    return updated
  }

  async pause(id: string): Promise<ReplicationJob> {
    const job = await this.getById(id)
    if (job.status !== JobStatus.RUNNING) {
      throw new Error('실행 중인 Job만 일시정지할 수 있습니다') // RUNNING 상태일 때만 PAUSED 가능
    }
    const updated = await ReplicationJobRepository.updateJob(id, {
      status: JobStatus.PAUSED,
    })
    if (!updated) throw new Error(`Failed to pause job: ${id}`)
    return updated
  }
}

export const replicationJobService = new ReplicationJobService()