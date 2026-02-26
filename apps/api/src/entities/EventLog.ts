import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm'
import { LogLevel } from '../types/enums'
import { Agent } from './Agent'
import { ReplicationJob } from './ReplicationJob'

@Entity('event_logs')
export class EventLog {

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ type: 'varchar' })
  level: LogLevel

  @Column()
  message: string

  // 어떤 Job에서 발생한 이벤트인지 (없을 수도 있음)
  @ManyToOne(() => ReplicationJob, { nullable: true })
  @JoinColumn({ name: 'job_id' })
  job: ReplicationJob | null

  // 어떤 Agent에서 발생한 이벤트인지 (없을 수도 있음)
  @ManyToOne(() => Agent, { nullable: true })
  @JoinColumn({ name: 'agent_id' })
  agent: Agent | null

  @CreateDateColumn()
  createdAt: Date
}