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
    if (!job) throw new Error(`Job not found: ${id}`)
    return job
  }

  async create(dto: CreateJobDto): Promise<ReplicationJob> {
    const data: Partial<ReplicationJob> = {
      name: dto.name,
      mode: dto.mode,
      sourcePath: dto.sourcePath,
      targetPath: dto.targetPath,
      status: JobStatus.READY,
      rpoSeconds: dto.rpoSeconds ?? null,
    }

    if (dto.agentId) {
      const agent = await AgentRepository.findById(dto.agentId)
      if (!agent) throw new Error(`Agent not found: ${dto.agentId}`)
      data.agent = agent
    }

    return ReplicationJobRepository.createJob(data)
  }

  async update(id: string, dto: UpdateJobDto): Promise<ReplicationJob> {
    const job = await this.getById(id)
    if (job.status === JobStatus.RUNNING) {
      throw new Error('실행 중인 Job은 수정할 수 없습니다')
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
    const job = await this.getById(id)
    if (job.status === JobStatus.RUNNING) {
      throw new Error('실행 중인 Job은 삭제할 수 없습니다')
    }
    const deleted = await ReplicationJobRepository.deleteJob(id)
    if (!deleted) throw new Error(`Failed to delete job: ${id}`)
  }

  async start(id: string): Promise<ReplicationJob> {
    const job = await this.getById(id)
    if (job.status === JobStatus.RUNNING) {
      throw new Error('이미 실행 중인 Job입니다')
    }

    // 상태를 RUNNING으로 변경
    const updated = await ReplicationJobRepository.updateJob(id, {
      status: JobStatus.RUNNING,
    })
    if (!updated) throw new Error(`Failed to start job: ${id}`)

    // 실제 파일 복제 비동기 실행 (응답은 바로 반환하고 백그라운드에서 복제)
    this.runReplication(id, job.sourcePath, job.targetPath).catch(console.error)

    return updated
  }

  async pause(id: string): Promise<ReplicationJob> {
    const job = await this.getById(id)
    if (job.status !== JobStatus.RUNNING) {
      throw new Error('실행 중인 Job만 일시정지할 수 있습니다')
    }
    const updated = await ReplicationJobRepository.updateJob(id, {
      status: JobStatus.PAUSED,
    })
    if (!updated) throw new Error(`Failed to pause job: ${id}`)
    return updated
  }

  // 실제 파일 복제 로직
  private async runReplication(id: string, sourcePath: string, targetPath: string): Promise<void> {
    const fs = await import('fs/promises')
    const path = await import('path')

    try {
      // targetPath 디렉토리 없으면 자동 생성
      await fs.mkdir(path.dirname(targetPath), { recursive: true })

      // 실제 파일 복제
      await fs.copyFile(sourcePath, targetPath)

      // 복제 성공 → SUCCESS
      await ReplicationJobRepository.updateJob(id, {
        status: JobStatus.SUCCESS,
      })

      console.log(`[복제 완료] ${sourcePath} → ${targetPath}`)

    } catch (error: any) {
      // 복제 실패 → FAILED
      await ReplicationJobRepository.updateJob(id, {
        status: JobStatus.FAILED,
      })

      console.error(`[복제 실패] ${error.message}`)
    }
  }
}

export const replicationJobService = new ReplicationJobService()