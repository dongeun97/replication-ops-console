import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { JobStatus, ReplicationMode } from '../types/enums'
import { Agent } from './Agent'

@Entity('replication_jobs')
export class ReplicationJob {

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  mode: ReplicationMode

  @Column()
  sourcePath: string

  @Column()
  targetPath: string

  @Column({ default: JobStatus.READY })
  status: JobStatus

  @Column({ default: 0 })
  progress: number

  // FILE 복제 전용
  @Column({ nullable: true })
  totalFiles: number | null

  @Column({ nullable: true })
  transferredFiles: number | null

  // BLOCK 복제 전용
  @Column({ nullable: true })
  totalBytes: number | null

  @Column({ nullable: true })
  transferredBytes: number | null

  @Column({ nullable: true })
  rpoSeconds: number | null

  @Column({ type: 'datetime', nullable: true })
  lastSyncedAt: Date | null

  // Agent와 관계 (여러 Job이 하나의 Agent에 속함)
  @ManyToOne(() => Agent, { nullable: true })
  @JoinColumn({ name: 'agent_id' })
  agent: Agent | null

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}