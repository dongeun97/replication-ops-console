import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'
import { AgentStatus } from '../types/enums'

@Entity('agents')
export class Agent {

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  name: string

  @Column({ type: 'varchar', default: AgentStatus.OFFLINE })
  status: AgentStatus

  @Column({ nullable: true })
  ipAddress: string

  @Column({ nullable: true })
  version: string

  @Column({ type: 'datetime', nullable: true })
  lastSeenAt: Date | null

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}