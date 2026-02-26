import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { JobStatus, ReplicationMode } from '../types/enums'
import { Agent } from './Agent'

@Entity('replication_jobs')
export class ReplicationJob {

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar' })
  name: string

  @Column({ type: 'varchar' })
  mode: ReplicationMode

  @Column({ type: 'varchar' })
  sourcePath: string

  @Column({ type: 'varchar' })
  targetPath: string

  @Column({ type: 'varchar', default: JobStatus.READY })
  status: JobStatus

  @Column({ type: 'int', default: 0 })
  progress: number

  // FILE 복제 전용
  @Column({ type: 'int', nullable: true })
  totalFiles: number | null

  @Column({ type: 'int', nullable: true })
  transferredFiles: number | null

  // BLOCK 복제 전용
  @Column({ type: 'int', nullable: true })
  totalBytes: number | null

  @Column({ type: 'int', nullable: true })
  transferredBytes: number | null

  @Column({ type: 'int', nullable: true })
  rpoSeconds: number | null

  @Column({ type: 'datetime', nullable: true })
  lastSyncedAt: Date | null

  @ManyToOne(() => Agent, { nullable: true })
  @JoinColumn({ name: 'agent_id' })
  agent: Agent | null

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}